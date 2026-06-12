import "dotenv/config";
import { pool, query } from "./db.js";

await query(`
  CREATE TABLE IF NOT EXISTS leads (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    email VARCHAR(220) NOT NULL,
    phone VARCHAR(60),
    company VARCHAR(180),
    project_type VARCHAR(120),
    budget VARCHAR(120),
    message TEXT NOT NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`);

await query(`
  CREATE INDEX IF NOT EXISTS leads_status_created_at_idx
  ON leads (status, created_at DESC);
`);

await query(`
  CREATE INDEX IF NOT EXISTS leads_search_idx
  ON leads USING gin (
    to_tsvector(
      'english',
      coalesce(name, '') || ' ' ||
      coalesce(email, '') || ' ' ||
      coalesce(phone, '') || ' ' ||
      coalesce(company, '') || ' ' ||
      coalesce(project_type, '') || ' ' ||
      coalesce(budget, '') || ' ' ||
      coalesce(message, '')
    )
  );
`);

console.log("Database migration completed.");
await pool.end();
