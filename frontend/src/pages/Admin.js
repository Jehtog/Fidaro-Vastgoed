import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Lock, Loader2, LogOut, Plus, X, Trash2, LayoutDashboard, Users, CreditCard, Calculator, Settings, ArrowRight } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_35e0d8c8-8484-434c-b0cb-1a5cfc9d3012/artifacts/p4sighyv_Untitled%20design%20%2811%29.png";

// Helper: derive rent category label from total.
const categoryLabel = (total) => {
  if (total == null) return "—";
  if (total < 144) return "Sociaal";
  if (total < 187) return "Middenhuur";
  return "Vrije sector";
};

// Helper: format a JS Date to value usable in <input type="datetime-local">.
const toLocalInput = (d) => {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getFullYear() +
    "-" + pad(d.getMonth() + 1) +
    "-" + pad(d.getDate()) +
    "T" + pad(d.getHours()) +
    ":" + pad(d.getMinutes())
  );
};

// FastAPI 422 returns detail as an array of {type, loc, msg, input, ctx}.
// React cannot render objects directly, so we always coerce to a string here.
const formatApiError = (err) => {
  const detail = err?.response?.data?.detail;
  if (!detail) return "Opslaan mislukt";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((d) => d?.msg || d?.type || "Validatiefout").join(" · ");
  }
  return "Opslaan mislukt";
};

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("fidaro_admin_token") || "");
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("overview");
  const [adminMode, setAdminMode] = useState(false);

  // PII masking helper
  const maskPII = (val) => {
    if (!val) return '—';
    const s = String(val);
    if (s.length <= 2) return '••';
    return s[0] + '•'.repeat(Math.min(s.length - 2, 8)) + s[s.length - 1];
  };
  const [showScoreForm, setShowScoreForm] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const load = async (tok) => {
    setLoading(true);
    try {
      const [a, b, c] = await Promise.all([
        axios.get(`${API}/admin/leads`, { headers: { Authorization: `Bearer ${tok}` } }),
        axios.get(`${API}/admin/payments`, { headers: { Authorization: `Bearer ${tok}` } }),
        axios.get(`${API}/admin/wws-scores`, { headers: { Authorization: `Bearer ${tok}` } }),
      ]);
      setLeads(a.data || []);
      setPayments(b.data || []);
      setScores(c.data || []);
    } catch (e) {
      toast.error("Laden mislukt");
      if (e?.response?.status === 401) {
        localStorage.removeItem("fidaro_admin_token");
        setToken("");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) load(token);
  }, [token]);

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/admin/login`, { password });
      localStorage.setItem("fidaro_admin_token", res.data.token);
      setToken(res.data.token);
    } catch {
      toast.error("Ongeldig wachtwoord");
    }
  };

  const logout = () => {
    localStorage.removeItem("fidaro_admin_token");
    setToken("");
    setLeads([]);
    setPayments([]);
    setScores([]);
  };

  const deleteScore = async (id) => {
    if (!window.confirm("Deze WWS-score verwijderen?")) return;
    try {
      await axios.delete(`${API}/admin/wws-scores/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setScores(scores.filter((s) => s.id !== id));
      toast.success("Verwijderd");
    } catch {
      toast.error("Verwijderen mislukt");
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Deze lead verwijderen?")) return;
    try {
      await axios.delete(`${API}/admin/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeads(leads.filter((l) => l.id !== id));
      toast.success("Lead verwijderd");
    } catch {
      toast.error("Verwijderen mislukt");
    }
  };

  const deletePayment = async (id) => {
    if (!window.confirm("Deze betaling verwijderen?")) return;
    try {
      await axios.delete(`${API}/admin/payments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(payments.filter((p) => p.id !== id));
      toast.success("Betaling verwijderd");
    } catch {
      toast.error("Verwijderen mislukt");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-fidaro-green-light/40">
        <form
          onSubmit={login}
          data-testid="admin-login-form"
          className="bg-white rounded-3xl shadow-[0_30px_70px_-25px_rgba(15,20,16,0.18)] border border-fidaro-green-light p-10 max-w-md w-full"
        >
          <img src={LOGO_URL} alt="Fidaro" className="h-20 w-20 mx-auto object-contain" />
          <h1 className="mt-4 font-display text-3xl text-center text-fidaro-text-dark">Fidaro Admin</h1>
          <p className="mt-2 text-sm text-center text-fidaro-text-muted">Log in om leads en scores te bekijken.</p>
          <input
            data-testid="admin-password-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wachtwoord"
            className="mt-6 w-full bg-fidaro-green-light/40 border border-fidaro-green-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fidaro-green focus:ring-2 focus:ring-fidaro-green/20"
            required
          />
          <button
            data-testid="admin-login-btn"
            type="submit"
            className="mt-4 w-full bg-fidaro-green hover:bg-fidaro-green-dark text-white rounded-xl px-6 py-3 font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" /> Inloggen
          </button>
        </form>
      </div>
    );
  }

  return (
    <div data-testid="admin-dashboard" className="min-h-screen bg-fidaro-green-light/30">
      <header className="bg-white border-b border-fidaro-green-light px-6 md:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={LOGO_URL} alt="Fidaro" className="h-16 w-16 object-contain" />
          <h1 className="font-display text-xl text-fidaro-text-dark tracking-tight">Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            data-testid="admin-mode-toggle"
            onClick={() => setAdminMode((v) => !v)}
            className={`hidden md:inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
              adminMode
                ? "bg-fidaro-green text-white"
                : "bg-fidaro-green-light/50 text-fidaro-text-muted hover:bg-fidaro-green-light"
            }`}
            title={adminMode ? "Beheer-modus actief" : "Beheer-modus inschakelen"}
          >
            <Settings className="w-3.5 h-3.5" />
            {adminMode ? "Beheer aan" : "Beheer"}
          </button>
          <button
            data-testid="admin-logout-btn"
            onClick={logout}
            className="text-sm text-fidaro-text-muted hover:text-fidaro-green flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Uitloggen
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            ["overview", "Overzicht", LayoutDashboard],
            ["leads", `Leads (${leads.length})`, Users],
            ["payments", `Betalingen (${payments.length})`, CreditCard],
            ["scores", `WWS-scores (${scores.length})`, Calculator],
          ].map(([id, label, Icon]) => (
            <button
              key={id}
              data-testid={`tab-${id}`}
              onClick={() => setTab(id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors inline-flex items-center gap-2 ${
                tab === id ? "bg-fidaro-green text-white" : "bg-white text-fidaro-text-dark hover:bg-fidaro-green-light"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-fidaro-green" />
          </div>
        )}

        {/* OVERVIEW TAB — landing dashboard */}
        {!loading && tab === "overview" && (
          <OverviewTab
            leads={leads}
            payments={payments}
            scores={scores}
            onNavigate={setTab}
          />
        )}

        {/* LEADS TAB */}
        {!loading && tab === "leads" && (
          <div data-testid="leads-tab">
            <div className="flex items-end justify-between gap-4 mb-5">
              <div className="rounded-xl bg-white border border-fidaro-green-light px-5 py-3">
                <div className="text-[10px] uppercase tracking-widest text-fidaro-text-muted">Totaal leads</div>
                <div className="mt-0.5 text-2xl font-bold tabular text-fidaro-ink">{leads.length}</div>
              </div>
              {adminMode && (
                <button
                  data-testid="add-lead-btn"
                  onClick={() => setShowLeadForm(true)}
                  className="inline-flex items-center gap-2 bg-fidaro-green hover:bg-fidaro-green-dark text-white rounded-full px-5 py-2.5 text-sm font-semibold transition-colors shadow-[0_6px_22px_rgba(79,111,87,0.25)]"
                >
                  <Plus className="w-4 h-4" /> Nieuwe lead
                </button>
              )}
            </div>
            <div className="bg-white rounded-2xl border border-fidaro-green-light overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-fidaro-green-light/50 text-left">
                    <tr>
                      <th className="px-4 py-3">Datum</th>
                      <th className="px-4 py-3">Naam</th>
                      <th className="px-4 py-3">E-mail</th>
                      <th className="px-4 py-3">Telefoon</th>
                      <th className="px-4 py-3">Adres</th>
                      <th className="px-4 py-3">Dienst</th>
                      <th className="px-4 py-3">Akkoord €</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                <tbody>
                  {leads.map((l, i) => (
                    <tr key={l.id || i} data-testid={`lead-row-${i}`} className="border-t border-fidaro-green-light/60">
                      <td className="px-4 py-3 text-fidaro-text-muted whitespace-nowrap">{new Date(l.created_at).toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium">{adminMode ? l.name : <span className="blur-sm select-none text-fidaro-text-muted">{maskPII(l.name)}</span>}</td>
                      <td className="px-4 py-3">{adminMode ? l.email : <span className="blur-sm select-none text-fidaro-text-muted">{maskPII(l.email)}</span>}</td>
                      <td className="px-4 py-3">{adminMode ? l.phone : <span className="blur-sm select-none text-fidaro-text-muted">{maskPII(l.phone)}</span>}</td>
                      <td className="px-4 py-3">{adminMode ? l.property_address : <span className="blur-sm select-none text-fidaro-text-muted">{maskPII(l.property_address)}</span>}</td>
                      <td className="px-4 py-3">
                        {l.service === "investment_plan" ? (
                          <span className="inline-block px-2 py-1 rounded text-xs bg-fidaro-green text-white">
                            Investment Plan €750
                          </span>
                        ) : (
                          <span className="text-xs text-fidaro-text-muted">{l.service}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {l.agreed_to_price ? (
                          <span className="text-fidaro-green-dark font-semibold">✓</span>
                        ) : (
                          <span className="text-fidaro-text-muted/40">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          data-testid={`delete-lead-${i}`}
                          onClick={() => deleteLead(l.id)}
                          className="text-fidaro-text-muted/60 hover:text-red-600 transition-colors"
                          title="Verwijderen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan="8" className="px-4 py-8 text-center text-fidaro-text-muted">Nog geen leads.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {!loading && tab === "payments" && (
          <div data-testid="payments-tab">
            <div className="flex items-end justify-between gap-4 mb-5">
              <div className="rounded-xl bg-white border border-fidaro-green-light px-5 py-3">
                <div className="text-[10px] uppercase tracking-widest text-fidaro-text-muted">Totaal betalingen</div>
                <div className="mt-0.5 text-2xl font-bold tabular text-fidaro-ink">{payments.length}</div>
              </div>
              {adminMode && (
                <button
                  data-testid="add-payment-btn"
                  onClick={() => setShowPaymentForm(true)}
                  className="inline-flex items-center gap-2 bg-fidaro-green hover:bg-fidaro-green-dark text-white rounded-full px-5 py-2.5 text-sm font-semibold transition-colors shadow-[0_6px_22px_rgba(79,111,87,0.25)]"
                >
                  <Plus className="w-4 h-4" /> Nieuwe betaling
                </button>
              )}
            </div>
            <div className="bg-white rounded-2xl border border-fidaro-green-light overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-fidaro-green-light/50 text-left">
                    <tr>
                      <th className="px-4 py-3">Datum</th>
                      <th className="px-4 py-3">Bedrag</th>
                      <th className="px-4 py-3">Package</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Naam</th>
                      <th className="px-4 py-3">E-mail</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                <tbody>
                  {payments.map((p, i) => (
                    <tr key={p.id || i} data-testid={`payment-row-${i}`} className="border-t border-fidaro-green-light/60">
                      <td className="px-4 py-3 text-fidaro-text-muted whitespace-nowrap">{new Date(p.created_at).toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium">€{p.amount} {p.currency?.toUpperCase()}</td>
                      <td className="px-4 py-3">{p.package_id}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          p.payment_status === "paid" ? "bg-fidaro-green text-white" : "bg-fidaro-silver/30 text-fidaro-text-dark"
                        }`}>
                          {p.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{adminMode ? (p.metadata?.lead_name || <span className="text-fidaro-text-muted/40">—</span>) : <span className="blur-sm select-none text-fidaro-text-muted">{maskPII(p.metadata?.lead_name)}</span>}</td>
                      <td className="px-4 py-3">{adminMode ? (p.metadata?.lead_email || <span className="text-fidaro-text-muted/40">—</span>) : <span className="blur-sm select-none text-fidaro-text-muted">{maskPII(p.metadata?.lead_email)}</span>}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          data-testid={`delete-payment-${i}`}
                          onClick={() => deletePayment(p.id)}
                          className="text-fidaro-text-muted/60 hover:text-red-600 transition-colors"
                          title="Verwijderen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-fidaro-text-muted">Nog geen betalingen.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            </div>
          </div>
        )}

        {/* WWS SCORES TAB */}
        {!loading && tab === "scores" && (
          <div data-testid="scores-tab">
            {/* Top bar with stats + add button */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
              <div className="rounded-xl bg-white border border-fidaro-green-light px-5 py-3">
                <div className="text-[10px] uppercase tracking-widest text-fidaro-text-muted">Totaal WWS-scores</div>
                <div className="mt-0.5 text-2xl font-bold tabular text-fidaro-ink">{scores.length}</div>
              </div>
              {adminMode && (
                <button
                  data-testid="add-score-btn"
                  onClick={() => setShowScoreForm(true)}
                  className="inline-flex items-center gap-2 bg-fidaro-green hover:bg-fidaro-green-dark text-white rounded-full px-5 py-2.5 text-sm font-semibold transition-colors shadow-[0_6px_22px_rgba(79,111,87,0.25)]"
                >
                  <Plus className="w-4 h-4" /> Nieuwe invoer
                </button>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-fidaro-green-light overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-fidaro-green-light/50 text-left">
                    <tr>
                      <th className="px-4 py-3">Datum &amp; tijd</th>
                      <th className="px-4 py-3">Naam</th>
                      <th className="px-4 py-3">E-mail</th>
                      <th className="px-4 py-3">Telefoon</th>
                      <th className="px-4 py-3">Adres</th>
                      <th className="px-4 py-3 text-right">Score</th>
                      <th className="px-4 py-3">Categorie</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((s, i) => (
                      <tr key={s.id || i} data-testid={`score-row-${i}`} className="border-t border-fidaro-green-light/60">
                        <td className="px-4 py-3 text-fidaro-text-muted whitespace-nowrap">
                          {new Date(s.created_at).toLocaleString("nl-NL", {
                            day: "2-digit", month: "2-digit", year: "numeric",
                            hour: "2-digit", minute: "2-digit",
                          })}
                        </td>
                        <td className="px-4 py-3 font-medium">{adminMode ? (s.name || <span className="text-fidaro-text-muted/40">—</span>) : <span className="blur-sm select-none text-fidaro-text-muted">{maskPII(s.name)}</span>}</td>
                        <td className="px-4 py-3">{adminMode ? (s.email || <span className="text-fidaro-text-muted/40">—</span>) : <span className="blur-sm select-none text-fidaro-text-muted">{maskPII(s.email)}</span>}</td>
                        <td className="px-4 py-3">{adminMode ? (s.phone || <span className="text-fidaro-text-muted/40">—</span>) : <span className="blur-sm select-none text-fidaro-text-muted">{maskPII(s.phone)}</span>}</td>
                        <td className="px-4 py-3">{adminMode ? (s.property_address || <span className="text-fidaro-text-muted/40">—</span>) : <span className="blur-sm select-none text-fidaro-text-muted">{maskPII(s.property_address)}</span>}</td>
                        <td className="px-4 py-3 text-right font-bold tabular text-fidaro-green-dark">{s.total}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-1 rounded text-xs ${
                            s.total >= 187
                              ? "bg-fidaro-green text-white"
                              : s.total >= 144
                              ? "bg-fidaro-green-light text-fidaro-green-dark"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {categoryLabel(s.total)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            data-testid={`delete-score-${i}`}
                            onClick={() => deleteScore(s.id)}
                            className="text-fidaro-text-muted/60 hover:text-red-600 transition-colors"
                            title="Verwijderen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {scores.length === 0 && (
                      <tr>
                        <td colSpan="8" className="px-4 py-8 text-center text-fidaro-text-muted">
                          Nog geen WWS-scores opgenomen.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MANUAL WWS SCORE ENTRY MODAL */}
      {showScoreForm && (
        <ScoreEntryModal
          token={token}
          onClose={() => setShowScoreForm(false)}
          onCreated={(s) => {
            setScores([s, ...scores]);
            setShowScoreForm(false);
            toast.success("WWS-score toegevoegd");
          }}
        />
      )}

      {showLeadForm && (
        <LeadEntryModal
          token={token}
          onClose={() => setShowLeadForm(false)}
          onCreated={(l) => {
            setLeads([l, ...leads]);
            setShowLeadForm(false);
            toast.success("Lead toegevoegd");
          }}
        />
      )}

      {showPaymentForm && (
        <PaymentEntryModal
          token={token}
          onClose={() => setShowPaymentForm(false)}
          onCreated={(p) => {
            setPayments([p, ...payments]);
            setShowPaymentForm(false);
            toast.success("Betaling toegevoegd");
          }}
        />
      )}
    </div>
  );
}


function ScoreEntryModal({ token, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    property_address: "",
    total: "",
    note: "",
    created_at: toLocalInput(new Date()),
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const totalNum = parseFloat(form.total);
    if (Number.isNaN(totalNum)) {
      toast.error("Voer een geldige WWS-score in");
      return;
    }
    setSaving(true);
    try {
      // datetime-local has no timezone; convert to ISO with local tz preserved.
      const iso = new Date(form.created_at).toISOString();
      const res = await axios.post(
        `${API}/admin/wws-scores`,
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          property_address: form.property_address,
          total: totalNum,
          category:
            totalNum < 144 ? "social" : totalNum < 187 ? "middle" : "free",
          note: form.note,
          created_at: iso,
          source: "admin_manual",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onCreated(res.data);
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full bg-white border border-fidaro-green-light rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-fidaro-green focus:ring-2 focus:ring-fidaro-green/20 transition-colors";

  return (
    <div
      data-testid="score-entry-modal"
      className="fixed inset-0 z-50 bg-fidaro-green-dark/45 backdrop-blur flex items-center justify-center p-4 overflow-y-auto"
    >
      <form
        onSubmit={submit}
        className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl my-8"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-fidaro-green font-mono">
              Handmatige WWS-invoer
            </div>
            <h3 className="mt-1 font-display text-2xl text-fidaro-ink">Nieuwe WWS-score</h3>
          </div>
          <button
            type="button"
            data-testid="score-entry-close"
            onClick={onClose}
            className="text-fidaro-text-muted hover:text-fidaro-ink p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-fidaro-text-muted">Naam</span>
            <input
              data-testid="score-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`${inputCls} mt-1.5`}
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-fidaro-text-muted">E-mail</span>
            <input
              data-testid="score-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`${inputCls} mt-1.5`}
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-fidaro-text-muted">Telefoon</span>
            <input
              data-testid="score-phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={`${inputCls} mt-1.5`}
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-fidaro-text-muted">Adres</span>
            <input
              data-testid="score-address"
              value={form.property_address}
              onChange={(e) => setForm({ ...form, property_address: e.target.value })}
              className={`${inputCls} mt-1.5`}
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-fidaro-text-muted">
              WWS-score *
            </span>
            <input
              data-testid="score-total"
              type="number"
              step="0.25"
              required
              value={form.total}
              onChange={(e) => setForm({ ...form, total: e.target.value })}
              className={`${inputCls} mt-1.5`}
              placeholder="bijv. 175"
            />
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-fidaro-text-muted">
              Datum &amp; tijd *
            </span>
            <input
              data-testid="score-datetime"
              type="datetime-local"
              required
              value={form.created_at}
              onChange={(e) => setForm({ ...form, created_at: e.target.value })}
              className={`${inputCls} mt-1.5`}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-fidaro-text-muted">Notitie</span>
            <textarea
              data-testid="score-note"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              rows={2}
              className={`${inputCls} mt-1.5 resize-none`}
            />
          </label>
        </div>

        {form.total && !Number.isNaN(parseFloat(form.total)) && (
          <div className="mt-4 text-xs text-fidaro-text-muted">
            Categorie: <span className="font-semibold text-fidaro-ink">
              {categoryLabel(parseFloat(form.total))}
            </span>
          </div>
        )}

        <div className="mt-7 flex gap-3">
          <button
            type="button"
            data-testid="score-cancel-btn"
            onClick={onClose}
            className="flex-1 border border-fidaro-green-light text-fidaro-text-muted rounded-full px-4 py-3 hover:bg-fidaro-green-light/40 transition-colors"
          >
            Annuleren
          </button>
          <button
            type="submit"
            data-testid="score-save-btn"
            disabled={saving}
            className="flex-[2] bg-fidaro-green hover:bg-fidaro-green-dark disabled:opacity-60 text-white rounded-full px-4 py-3 font-semibold transition-colors flex items-center justify-center gap-2 shadow-[0_6px_22px_rgba(79,111,87,0.3)]"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Opslaan
          </button>
        </div>
      </form>
    </div>
  );
}


function LeadEntryModal({ token, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    property_address: "",
    service: "quickscan",
    message: "",
    agreed_to_price: false,
    created_at: toLocalInput(new Date()),
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Naam en e-mail zijn verplicht");
      return;
    }
    setSaving(true);
    try {
      const iso = new Date(form.created_at).toISOString();
      const res = await axios.post(
        `${API}/admin/leads`,
        {
          ...form,
          source: "admin_manual",
          language: "nl",
          created_at: iso,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onCreated(res.data);
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full bg-white border border-fidaro-green-light rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-fidaro-green focus:ring-2 focus:ring-fidaro-green/20 transition-colors";
  const lblCls = "text-[10px] font-mono uppercase tracking-[0.18em] text-fidaro-text-muted";

  return (
    <div
      data-testid="lead-entry-modal"
      className="fixed inset-0 z-50 bg-fidaro-green-dark/45 backdrop-blur flex items-center justify-center p-4 overflow-y-auto"
    >
      <form onSubmit={submit} className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl my-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-fidaro-green font-mono">
              Handmatige lead
            </div>
            <h3 className="mt-1 font-display text-2xl text-fidaro-ink">Nieuwe lead</h3>
          </div>
          <button type="button" data-testid="lead-entry-close" onClick={onClose} className="text-fidaro-text-muted hover:text-fidaro-ink p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className={lblCls}>Naam *</span>
            <input data-testid="lead-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`${inputCls} mt-1.5`} />
          </label>
          <label className="block">
            <span className={lblCls}>E-mail *</span>
            <input data-testid="lead-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`${inputCls} mt-1.5`} />
          </label>
          <label className="block">
            <span className={lblCls}>Telefoon</span>
            <input data-testid="lead-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={`${inputCls} mt-1.5`} />
          </label>
          <label className="block">
            <span className={lblCls}>Adres</span>
            <input data-testid="lead-address" value={form.property_address} onChange={(e) => setForm({ ...form, property_address: e.target.value })} className={`${inputCls} mt-1.5`} />
          </label>
          <label className="block">
            <span className={lblCls}>Dienst</span>
            <select data-testid="lead-service" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className={`${inputCls} mt-1.5`}>
              <option value="quickscan">Quick-Scan (€99)</option>
              <option value="investment_plan">Investment Plan (€750)</option>
              <option value="consult">Consult</option>
            </select>
          </label>
          <label className="block">
            <span className={lblCls}>Datum &amp; tijd *</span>
            <input data-testid="lead-datetime" type="datetime-local" required value={form.created_at} onChange={(e) => setForm({ ...form, created_at: e.target.value })} className={`${inputCls} mt-1.5`} />
          </label>
          <label className="block sm:col-span-2">
            <span className={lblCls}>Bericht / notitie</span>
            <textarea data-testid="lead-message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={2} className={`${inputCls} mt-1.5 resize-none`} />
          </label>
          {form.service === "investment_plan" && (
            <label className="sm:col-span-2 flex items-center gap-3 p-3 rounded-xl border border-fidaro-green-light bg-fidaro-green-light/30">
              <input type="checkbox" data-testid="lead-agree" checked={form.agreed_to_price} onChange={(e) => setForm({ ...form, agreed_to_price: e.target.checked })} className="w-5 h-5 accent-fidaro-green" />
              <span className="text-sm text-fidaro-ink">Klant heeft akkoord gegeven voor € 750 tarief</span>
            </label>
          )}
        </div>

        <div className="mt-7 flex gap-3">
          <button type="button" data-testid="lead-cancel-btn" onClick={onClose} className="flex-1 border border-fidaro-green-light text-fidaro-text-muted rounded-full px-4 py-3 hover:bg-fidaro-green-light/40 transition-colors">Annuleren</button>
          <button type="submit" data-testid="lead-save-btn" disabled={saving} className="flex-[2] bg-fidaro-green hover:bg-fidaro-green-dark disabled:opacity-60 text-white rounded-full px-4 py-3 font-semibold transition-colors flex items-center justify-center gap-2 shadow-[0_6px_22px_rgba(79,111,87,0.3)]">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Opslaan
          </button>
        </div>
      </form>
    </div>
  );
}


function PaymentEntryModal({ token, onClose, onCreated }) {
  const [form, setForm] = useState({
    amount: "99",
    currency: "EUR",
    package_id: "quickscan",
    payment_status: "paid",
    lead_name: "",
    lead_email: "",
    lead_phone: "",
    lead_property_address: "",
    note: "",
    created_at: toLocalInput(new Date()),
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(form.amount);
    if (Number.isNaN(amt) || amt <= 0) {
      toast.error("Voer een geldig bedrag in");
      return;
    }
    setSaving(true);
    try {
      const iso = new Date(form.created_at).toISOString();
      const res = await axios.post(
        `${API}/admin/payments`,
        { ...form, amount: amt, created_at: iso },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onCreated(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Opslaan mislukt");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full bg-white border border-fidaro-green-light rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-fidaro-green focus:ring-2 focus:ring-fidaro-green/20 transition-colors";
  const lblCls = "text-[10px] font-mono uppercase tracking-[0.18em] text-fidaro-text-muted";

  return (
    <div
      data-testid="payment-entry-modal"
      className="fixed inset-0 z-50 bg-fidaro-green-dark/45 backdrop-blur flex items-center justify-center p-4 overflow-y-auto"
    >
      <form onSubmit={submit} className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl my-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-fidaro-green font-mono">
              Handmatige betaling
            </div>
            <h3 className="mt-1 font-display text-2xl text-fidaro-ink">Nieuwe betaling</h3>
            <p className="mt-1 text-xs text-fidaro-text-muted">Voor handmatige overschrijvingen of facturen buiten Stripe om.</p>
          </div>
          <button type="button" data-testid="payment-entry-close" onClick={onClose} className="text-fidaro-text-muted hover:text-fidaro-ink p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className={lblCls}>Bedrag (€) *</span>
            <input data-testid="payment-amount" type="number" step="0.01" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={`${inputCls} mt-1.5`} />
          </label>
          <label className="block">
            <span className={lblCls}>Package</span>
            <select data-testid="payment-package" value={form.package_id} onChange={(e) => setForm({ ...form, package_id: e.target.value })} className={`${inputCls} mt-1.5`}>
              <option value="quickscan">Quick-Scan</option>
              <option value="investment_plan">Investment Plan</option>
              <option value="consult">Consult</option>
              <option value="other">Anders</option>
            </select>
          </label>
          <label className="block">
            <span className={lblCls}>Status</span>
            <select data-testid="payment-status" value={form.payment_status} onChange={(e) => setForm({ ...form, payment_status: e.target.value })} className={`${inputCls} mt-1.5`}>
              <option value="paid">Betaald</option>
              <option value="pending">In afwachting</option>
              <option value="refunded">Terugbetaald</option>
            </select>
          </label>
          <label className="block">
            <span className={lblCls}>Datum &amp; tijd *</span>
            <input data-testid="payment-datetime" type="datetime-local" required value={form.created_at} onChange={(e) => setForm({ ...form, created_at: e.target.value })} className={`${inputCls} mt-1.5`} />
          </label>
          <label className="block">
            <span className={lblCls}>Naam klant</span>
            <input data-testid="payment-lead-name" value={form.lead_name} onChange={(e) => setForm({ ...form, lead_name: e.target.value })} className={`${inputCls} mt-1.5`} />
          </label>
          <label className="block">
            <span className={lblCls}>E-mail klant</span>
            <input data-testid="payment-lead-email" type="email" value={form.lead_email} onChange={(e) => setForm({ ...form, lead_email: e.target.value })} className={`${inputCls} mt-1.5`} />
          </label>
          <label className="block">
            <span className={lblCls}>Telefoon</span>
            <input data-testid="payment-lead-phone" value={form.lead_phone} onChange={(e) => setForm({ ...form, lead_phone: e.target.value })} className={`${inputCls} mt-1.5`} />
          </label>
          <label className="block">
            <span className={lblCls}>Adres pand</span>
            <input data-testid="payment-lead-address" value={form.lead_property_address} onChange={(e) => setForm({ ...form, lead_property_address: e.target.value })} className={`${inputCls} mt-1.5`} />
          </label>
          <label className="block sm:col-span-2">
            <span className={lblCls}>Notitie</span>
            <textarea data-testid="payment-note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={2} className={`${inputCls} mt-1.5 resize-none`} />
          </label>
        </div>

        <div className="mt-7 flex gap-3">
          <button type="button" data-testid="payment-cancel-btn" onClick={onClose} className="flex-1 border border-fidaro-green-light text-fidaro-text-muted rounded-full px-4 py-3 hover:bg-fidaro-green-light/40 transition-colors">Annuleren</button>
          <button type="submit" data-testid="payment-save-btn" disabled={saving} className="flex-[2] bg-fidaro-green hover:bg-fidaro-green-dark disabled:opacity-60 text-white rounded-full px-4 py-3 font-semibold transition-colors flex items-center justify-center gap-2 shadow-[0_6px_22px_rgba(79,111,87,0.3)]">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Opslaan
          </button>
        </div>
      </form>
    </div>
  );
}


function OverviewTab({ leads, payments, scores, onNavigate }) {
  // Revenue: count only paid payments.
  const paidPayments = payments.filter((p) => p.payment_status === "paid");
  const totalRevenue = paidPayments.reduce(
    (sum, p) => sum + (parseFloat(p.amount) || 0),
    0
  );

  // 7-day windows for trend.
  const now = Date.now();
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const within7Days = (iso) => {
    const t = new Date(iso).getTime();
    return Number.isFinite(t) && now - t < WEEK_MS;
  };
  const leadsThisWeek = leads.filter((l) => within7Days(l.created_at)).length;
  const scoresThisWeek = scores.filter((s) => within7Days(s.created_at)).length;
  const revenueThisWeek = paidPayments
    .filter((p) => within7Days(p.created_at))
    .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

  const investmentPlanRequests = leads.filter(
    (l) => l.service === "investment_plan"
  ).length;

  const avgScore = scores.length
    ? Math.round(
        scores.reduce((sum, s) => sum + (parseFloat(s.total) || 0), 0) /
          scores.length
      )
    : null;

  const recentLeads = leads.slice(0, 5);
  const recentPayments = paidPayments.slice(0, 5);

  return (
    <div data-testid="overview-tab" className="space-y-8">
      {/* Hero greeting */}
      <div className="rounded-3xl bg-gradient-to-br from-fidaro-green-dark via-fidaro-green-dark to-fidaro-green p-8 md:p-10 text-white relative overflow-hidden">
        <div className="absolute -top-20 -right-16 w-72 h-72 bg-fidaro-green-bright/25 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="text-[10px] uppercase tracking-[0.22em] text-fidaro-green-bright font-mono">
            Welkom terug
          </div>
          <h2 className="mt-3 font-display text-3xl md:text-4xl tracking-tight">
            Fidaro Admin Overzicht
          </h2>
          <p className="mt-3 text-white/75 max-w-xl">
            Hier zie je in één oogopslag hoe je platform draait — aanvragen, betalingen en WWS-validaties.
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Totaal leads"
          value={leads.length}
          delta={`${leadsThisWeek} deze week`}
          icon={Users}
        />
        <KPICard
          label="Totale omzet (betaald)"
          value={`€ ${totalRevenue.toLocaleString("nl-NL")}`}
          delta={
            revenueThisWeek > 0
              ? `+ € ${revenueThisWeek.toLocaleString("nl-NL")} deze week`
              : "Geen omzet deze week"
          }
          icon={CreditCard}
        />
        <KPICard
          label="WWS-scores"
          value={scores.length}
          delta={
            avgScore != null
              ? `Gem. ${avgScore} pt · ${scoresThisWeek} deze week`
              : "Nog geen scores"
          }
          icon={Calculator}
        />
        <KPICard
          label="€750 aanvragen"
          value={investmentPlanRequests}
          delta="Investment Plan"
          icon={LayoutDashboard}
        />
      </div>

      {/* Navigation cards + recent activity */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          <NavTile
            icon={Users}
            title="Leads"
            count={leads.length}
            desc="Alle ingekomen aanvragen via contact, Quick-Scan en Investment Plan."
            onClick={() => onNavigate("leads")}
            testid="goto-leads"
          />
          <NavTile
            icon={CreditCard}
            title="Betalingen"
            count={payments.length}
            desc="Stripe-betalingen + handmatig geboekte transacties."
            onClick={() => onNavigate("payments")}
            testid="goto-payments"
          />
          <NavTile
            icon={Calculator}
            title="WWS-scores"
            count={scores.length}
            desc="Berekende scores via de calculator en handmatig opgenomen klantscores."
            onClick={() => onNavigate("scores")}
            testid="goto-scores"
          />
          <NavTile
            icon={LayoutDashboard}
            title="Website"
            count={null}
            desc="Bekijk de live website in een nieuw tabblad."
            onClick={() => window.open("/", "_blank")}
            testid="goto-website"
          />
        </div>

        {/* Recent activity feed */}
        <div className="bg-white rounded-3xl border border-fidaro-green-light p-6">
          <div className="text-[10px] uppercase tracking-[0.22em] text-fidaro-text-muted font-mono">
            Recente activiteit
          </div>
          <ul className="mt-4 space-y-3">
            {recentLeads.length === 0 && recentPayments.length === 0 && (
              <li className="text-sm text-fidaro-text-muted">Nog geen activiteit.</li>
            )}
            {recentPayments.slice(0, 3).map((p) => (
              <li key={`p-${p.id}`} className="flex items-start gap-3 text-sm">
                <span className="mt-1 w-2 h-2 rounded-full bg-fidaro-green flex-shrink-0" />
                <div>
                  <div className="text-fidaro-ink font-medium">
                    € {p.amount} {String(p.currency || "").toUpperCase()} betaald
                  </div>
                  <div className="text-xs text-fidaro-text-muted">
                    {adminMode ? (p.metadata?.lead_email || "—") : maskPII(p.metadata?.lead_email)} · {new Date(p.created_at).toLocaleString("nl-NL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </li>
            ))}
            {recentLeads.slice(0, 4).map((l) => (
              <li key={`l-${l.id}`} className="flex items-start gap-3 text-sm">
                <span className="mt-1 w-2 h-2 rounded-full bg-fidaro-green-bright flex-shrink-0" />
                <div>
                  <div className="text-fidaro-ink font-medium">
                    {adminMode ? l.name : maskPII(l.name)}
                    {l.service === "investment_plan" && (
                      <span className="ml-2 text-[10px] uppercase tracking-widest text-fidaro-green-dark font-semibold">
                        €750
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-fidaro-text-muted">
                    {adminMode ? l.email : maskPII(l.email)} · {new Date(l.created_at).toLocaleString("nl-NL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


function KPICard({ label, value, delta, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl border border-fidaro-green-light p-5">
      <div className="flex items-start justify-between">
        <div className="text-[10px] uppercase tracking-widest text-fidaro-text-muted font-mono">
          {label}
        </div>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-fidaro-green-light/60 flex items-center justify-center text-fidaro-green-dark">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-3 font-display text-3xl tabular text-fidaro-ink leading-none">
        {value}
      </div>
      {delta && (
        <div className="mt-2 text-xs text-fidaro-text-muted">{delta}</div>
      )}
    </div>
  );
}


function NavTile({ icon: Icon, title, count, desc, onClick, testid }) {
  return (
    <button
      onClick={onClick}
      data-testid={testid}
      className="group text-left bg-white rounded-3xl border border-fidaro-green-light p-6 hover:border-fidaro-green hover:shadow-[0_18px_45px_-22px_rgba(63,92,73,0.25)] hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl bg-fidaro-green-light/60 flex items-center justify-center text-fidaro-green-dark">
          <Icon className="w-5 h-5" />
        </div>
        {count != null && (
          <span className="text-fidaro-green-dark font-display text-xl tabular">
            {count}
          </span>
        )}
      </div>
      <div className="mt-5 font-display text-xl text-fidaro-ink tracking-tight">
        {title}
      </div>
      <p className="mt-1.5 text-sm text-fidaro-text-muted leading-relaxed">
        {desc}
      </p>
      <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-fidaro-green-dark group-hover:gap-2 transition-all">
        Openen <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </button>
  );
}
