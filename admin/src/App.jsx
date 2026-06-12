import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  CircleDot,
  Clock3,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  UserRound
} from "lucide-react";

const statuses = ["New", "Contacted", "Closed"];

export default function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem("nexora_admin_key") || "");
  const [status, setStatus] = useState("New");
  const [search, setSearch] = useState("");
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [statusCounts, setStatusCounts] = useState({ New: 0, Contacted: 0, Closed: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activePipeline = useMemo(() => {
    const pipelineTotal = Object.values(statusCounts).reduce((sum, count) => sum + count, 0) || 1;

    return statuses.map((item) => ({
      label: item,
      count: statusCounts[item] || 0,
      percentage: Math.round(((statusCounts[item] || 0) / pipelineTotal) * 100)
    }));
  }, [statusCounts]);

  useEffect(() => {
    if (!apiKey) return;
    const timeout = setTimeout(() => {
      fetchLeads();
    }, 250);

    return () => clearTimeout(timeout);
  }, [apiKey, status, search]);

  async function fetchLeads() {
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (search) params.set("search", search);

    try {
      const response = await fetch(`/api/leads?${params}`, {
        headers: { "x-admin-api-key": apiKey }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load leads.");
      }

      setLeads(data.leads || []);
      setTotal(data.total || 0);
      setStatusCounts(data.statusCounts || { New: 0, Contacted: 0, Closed: 0 });
      localStorage.setItem("nexora_admin_key", apiKey);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(leadId, nextStatus) {
    const previousLeads = leads;
    setLeads((current) => current.map((lead) => (
      lead.id === leadId ? { ...lead, status: nextStatus } : lead
    )));

    try {
      const response = await fetch(`/api/leads/${leadId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-api-key": apiKey
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update lead.");
      }

      await fetchLeads();
    } catch (updateError) {
      setLeads(previousLeads);
      setError(updateError.message);
    }
  }

  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-icon">N</div>
          <div>
            <strong>Nexora</strong>
            <span>Lead Command</span>
          </div>
        </div>

        <nav className="side-nav" aria-label="Admin navigation">
          <a className="is-active" href="/admin/leads">
            <CircleDot size={18} />
            Leads
          </a>
          <span>
            <ShieldCheck size={18} />
            Owner Access
          </span>
        </nav>

        <div className="secure-panel">
          <span>Admin API Key</span>
          <input
            type="password"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="Paste admin key"
            aria-label="Admin API key"
          />
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Contact Pipeline</p>
            <h1>Leads Dashboard</h1>
          </div>
          <div className="total-card">
            <span>Total Leads</span>
            <strong>{total}</strong>
          </div>
        </header>

        <section className="metrics-grid" aria-label="Lead status summary">
          {activePipeline.map((item) => (
            <article className="metric-card" key={item.label}>
              <div>
                <span>{item.label}</span>
                <strong>{item.count}</strong>
              </div>
              <div className="metric-track">
                <i style={{ width: `${item.percentage}%` }} />
              </div>
            </article>
          ))}
        </section>

        <section className="toolbar" aria-label="Lead filters">
          <div className="segmented">
            {statuses.map((item) => (
              <button
                className={status === item ? "is-active" : ""}
                key={item}
                type="button"
                onClick={() => setStatus(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="search-box">
            <Search size={18} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, company, message"
            />
          </label>
        </section>

        {error && <p className="notice error">{error}</p>}
        {!apiKey && <p className="notice">Enter your admin API key to load leads.</p>}

        <section className="leads-panel">
          <div className="table-head">
            <span>Lead</span>
            <span>Project</span>
            <span>Budget</span>
            <span>Submitted</span>
            <span>Status</span>
          </div>

          {loading && <div className="empty-state">Loading leads...</div>}

          {!loading && leads.length === 0 && apiKey && (
            <div className="empty-state">No leads match the current view.</div>
          )}

          {!loading && leads.map((lead) => (
            <article className="lead-row" key={lead.id}>
              <div className="lead-identity">
                <div className="avatar"><UserRound size={18} /></div>
                <div>
                  <strong>{lead.name}</strong>
                  <a href={`mailto:${lead.email}`}><Mail size={14} />{lead.email}</a>
                  {lead.phone && <a href={`tel:${lead.phone}`}><Phone size={14} />{lead.phone}</a>}
                  {lead.company && <span><Building2 size={14} />{lead.company}</span>}
                </div>
              </div>

              <div className="lead-project">
                <BriefcaseBusiness size={17} />
                <span>{lead.project_type || "General Inquiry"}</span>
                <p>{lead.message}</p>
              </div>

              <div className="budget">{lead.budget || "Not specified"}</div>

              <div className="date">
                <Clock3 size={16} />
                {formatDate(lead.created_at)}
              </div>

              <label className={`status-pill ${lead.status.toLowerCase()}`}>
                {lead.status === "Closed" && <CheckCircle2 size={15} />}
                <select
                  value={lead.status}
                  onChange={(event) => updateStatus(lead.id, event.target.value)}
                >
                  {statuses.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
