import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Lock, Loader2, LogOut, Plus, X, Trash2 } from "lucide-react";

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

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("fidaro_admin_token") || "");
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("leads");
  const [showScoreForm, setShowScoreForm] = useState(false);

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
        <button
          data-testid="admin-logout-btn"
          onClick={logout}
          className="text-sm text-fidaro-text-muted hover:text-fidaro-green flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Uitloggen
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            ["leads", `Leads (${leads.length})`],
            ["payments", `Betalingen (${payments.length})`],
            ["scores", `WWS-scores (${scores.length})`],
          ].map(([id, label]) => (
            <button
              key={id}
              data-testid={`tab-${id}`}
              onClick={() => setTab(id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === id ? "bg-fidaro-green text-white" : "bg-white text-fidaro-text-dark hover:bg-fidaro-green-light"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-fidaro-green" />
          </div>
        )}

        {/* LEADS TAB */}
        {!loading && tab === "leads" && (
          <div data-testid="leads-table" className="bg-white rounded-2xl border border-fidaro-green-light overflow-hidden">
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
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l, i) => (
                    <tr key={l.id || i} className="border-t border-fidaro-green-light/60">
                      <td className="px-4 py-3 text-fidaro-text-muted">{new Date(l.created_at).toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium">{l.name}</td>
                      <td className="px-4 py-3">{l.email}</td>
                      <td className="px-4 py-3">{l.phone}</td>
                      <td className="px-4 py-3">{l.property_address}</td>
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
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-fidaro-text-muted">Nog geen leads.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {!loading && tab === "payments" && (
          <div data-testid="payments-table" className="bg-white rounded-2xl border border-fidaro-green-light overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-fidaro-green-light/50 text-left">
                  <tr>
                    <th className="px-4 py-3">Datum</th>
                    <th className="px-4 py-3">Bedrag</th>
                    <th className="px-4 py-3">Package</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">E-mail</th>
                    <th className="px-4 py-3">Session</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, i) => (
                    <tr key={p.id || i} className="border-t border-fidaro-green-light/60">
                      <td className="px-4 py-3 text-fidaro-text-muted">{new Date(p.created_at).toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium">€{p.amount} {p.currency?.toUpperCase()}</td>
                      <td className="px-4 py-3">{p.package_id}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          p.payment_status === "paid" ? "bg-fidaro-green text-white" : "bg-fidaro-silver/30 text-fidaro-text-dark"
                        }`}>
                          {p.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{p.metadata?.lead_email}</td>
                      <td className="px-4 py-3 text-xs text-fidaro-text-muted truncate max-w-[180px]">{p.session_id}</td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-fidaro-text-muted">Nog geen betalingen.</td>
                    </tr>
                  )}
                </tbody>
              </table>
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
              <button
                data-testid="add-score-btn"
                onClick={() => setShowScoreForm(true)}
                className="inline-flex items-center gap-2 bg-fidaro-green hover:bg-fidaro-green-dark text-white rounded-full px-5 py-2.5 text-sm font-semibold transition-colors shadow-[0_6px_22px_rgba(79,111,87,0.25)]"
              >
                <Plus className="w-4 h-4" /> Nieuwe invoer
              </button>
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
                        <td className="px-4 py-3 font-medium">{s.name || <span className="text-fidaro-text-muted/40">—</span>}</td>
                        <td className="px-4 py-3">{s.email || <span className="text-fidaro-text-muted/40">—</span>}</td>
                        <td className="px-4 py-3">{s.phone || <span className="text-fidaro-text-muted/40">—</span>}</td>
                        <td className="px-4 py-3">{s.property_address || <span className="text-fidaro-text-muted/40">—</span>}</td>
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
      toast.error(err?.response?.data?.detail || "Opslaan mislukt");
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
