import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { isDatabaseConfigured, query } from "./db.js";
import { sendLeadNotification } from "./email.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..", "..");
const app = express();
const port = Number(process.env.PORT || 5000);
const allowedStatuses = new Set(["New", "Contacted", "Closed"]);

app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.post("/api/leads", async (req, res) => {
  if (!isDatabaseConfigured) {
    return res.status(503).json({
      message: "Contact form database is not configured. Create a .env file with DATABASE_URL and run the migration."
    });
  }

  const lead = normalizeLead(req.body);
  const errors = validateLead(lead);

  if (errors.length > 0) {
    return res.status(400).json({ message: "Please check the form fields.", errors });
  }

  try {
    const result = await query(
      `INSERT INTO leads (name, email, phone, company, project_type, budget, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, phone, company, project_type, budget, message, status, created_at`,
      [
        lead.name,
        lead.email,
        lead.phone,
        lead.company,
        lead.projectType,
        lead.budget,
        lead.message
      ]
    );

    const savedLead = result.rows[0];
    sendLeadNotification(savedLead).catch((error) => {
      console.error("Lead email notification failed:", error);
    });

    res.status(201).json({
      message: "Lead submitted successfully.",
      lead: savedLead
    });
  } catch (error) {
    console.error("Lead submission failed:", error);
    res.status(500).json({ message: getLeadSubmissionErrorMessage(error) });
  }
});

app.get("/api/leads", requireAdmin, async (req, res) => {
  const status = String(req.query.status || "").trim();
  const search = String(req.query.search || "").trim();
  const params = [];
  const where = [];

  if (status && allowedStatuses.has(status)) {
    params.push(status);
    where.push(`status = $${params.length}`);
  }

  if (search) {
    params.push(`%${search}%`);
    where.push(`(
      name ILIKE $${params.length} OR
      email ILIKE $${params.length} OR
      phone ILIKE $${params.length} OR
      company ILIKE $${params.length} OR
      project_type ILIKE $${params.length} OR
      budget ILIKE $${params.length} OR
      message ILIKE $${params.length}
    )`);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  try {
    const [leadsResult, countResult, statusResult] = await Promise.all([
      query(
        `SELECT id, name, email, phone, company, project_type, budget, message, status, created_at
         FROM leads
         ${whereSql}
         ORDER BY created_at DESC
         LIMIT 250`,
        params
      ),
      query(`SELECT COUNT(*)::int AS total FROM leads ${whereSql}`, params),
      query(`
        SELECT status, COUNT(*)::int AS count
        FROM leads
        GROUP BY status
      `)
    ]);

    res.json({
      leads: leadsResult.rows,
      total: countResult.rows[0].total,
      statusCounts: statusResult.rows.reduce((counts, row) => {
        counts[row.status] = row.count;
        return counts;
      }, { New: 0, Contacted: 0, Closed: 0 })
    });
  } catch (error) {
    console.error("Lead list failed:", error);
    res.status(500).json({ message: "Unable to load leads." });
  }
});

app.patch("/api/leads/:id/status", requireAdmin, async (req, res) => {
  const status = String(req.body.status || "").trim();

  if (!allowedStatuses.has(status)) {
    return res.status(400).json({ message: "Invalid lead status." });
  }

  try {
    const result = await query(
      `UPDATE leads
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING id, name, email, phone, company, project_type, budget, message, status, created_at`,
      [status, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Lead not found." });
    }

    res.json({ lead: result.rows[0] });
  } catch (error) {
    console.error("Lead status update failed:", error);
    res.status(500).json({ message: "Unable to update lead status." });
  }
});

app.use(express.static(rootDir));
app.use("/admin", express.static(path.join(rootDir, "admin", "dist")));
app.get("/admin/leads", (_req, res) => {
  res.sendFile(path.join(rootDir, "admin", "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Nexora contact system running on port ${port}`);
});

function requireAdmin(req, res, next) {
  const configuredKey = process.env.ADMIN_API_KEY;
  const providedKey = req.header("x-admin-api-key");

  if (!configuredKey) {
    return res.status(500).json({ message: "Admin API key is not configured." });
  }

  if (providedKey !== configuredKey) {
    return res.status(401).json({ message: "Invalid admin API key." });
  }

  next();
}

function normalizeLead(body) {
  return {
    name: clean(body.name),
    email: clean(body.email).toLowerCase(),
    phone: clean(body.phone),
    company: clean(body.company),
    projectType: clean(body.projectType || body.project_type),
    budget: clean(body.budget),
    message: clean(body.message)
  };
}

function clean(value) {
  return String(value || "").trim();
}

function validateLead(lead) {
  const errors = [];

  if (lead.name.length < 2) errors.push("Name is required.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) errors.push("A valid email is required.");
  if (lead.message.length < 10) errors.push("Message should include at least 10 characters.");

  return errors;
}

function getLeadSubmissionErrorMessage(error) {
  if (error?.code === "ECONNREFUSED" || error?.code === "ENOTFOUND") {
    return "Database connection failed. Check DATABASE_URL and make sure PostgreSQL is running.";
  }

  if (error?.code === "3D000") {
    return "Lead database does not exist. Create the database, then run npm run migrate --prefix server.";
  }

  if (error?.code === "42P01") {
    return "Leads table is missing. Run npm run migrate --prefix server.";
  }

  return "Unable to submit lead right now. Please try again later.";
}
