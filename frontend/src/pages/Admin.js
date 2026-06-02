import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Lock, Loader2, LogOut, Plus } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const emptyManualLead = {
  name: "",
  email: "",
  phone: "",
  property_address: "",
  role: "",
  service: "",
  message: "",
  language: "nl",
  source: "manual_admin",
  agreed_to_price: false,
  construction_year: "",
  woz_value: "",
  created_at: "",
};

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("fidaro_admin_token") || "");
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingLead, setSavingLead] = useState(false);
  const [tab, setTab] = useState("leads");
  const [showManualLeadForm, setShowManualLeadForm] = useState(false);
  const [manualLead, setManualLead] = useState(emptyManualLead);

  const load = async (tok) => {
    setLoading(true);
    try {
      const [a, b] = await Promise.all([
        axios.get(`${API}/admin/leads`, { headers: { Authorization: `Bearer ${tok}` } }),
        axios.get(`${API}/admin/payments`, { headers: { Authorization: `Bearer ${tok}` } }),
      ]);
      setLeads(a.data || []);
      setPayments(b.data || []);
    } catch (e) {
      toast.error("Failed to load");
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
      toast.error("Invalid password");
    }
  };

  const logout = () => {
    localStorage.removeItem("fidaro_admin_token");
    setToken("");
    setLeads([]);
    setPayments([]);
  };

  const updateManualLead = (field, value) => {
    setManualLead((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const createManualLead = async (e) => {
    e.preventDefault();

    if (!manualLead.name || !manualLead.email) {
      toast.error("Naam en e-mail zijn verplicht");
      return;
    }

    setSavingLead(true);

    try {
      const payload = {
        ...manualLead,
        created_at: manualLead.created_at
          ? new Date(manualLead.created_at).toISOString()
          : undefined,
      };

      const res = await axios.post(`${API}/admin/leads`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLeads((prev) =>
        [res.data, ...prev].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      );

      setManualLead(emptyManualLead);
      setShowManualLeadForm(false);
      toast.success("Lead toegevoegd");
    } catch (e) {
      console.error(e);
      toast.error("Lead toevoegen mislukt");
    } finally {
      setSavingLead(false);
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
          <Lock className="w-10 h-10 text-fidaro-green mx-auto" />
          <h1 className="mt-4 font-serif text-3xl text-center text-fidaro-text-dark">Fidaro Admin</h1>
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
            className="mt-4 w-full bg-fidaro-green hover:bg-fidaro-green-dark text-white rounded-xl px-6 py-3 font-medium transition-colors"
          >
            Inloggen
          </button>
        </form>
      </div>
    );
  }

  return (
    <div data-testid="admin-dashboard" className="min-h-screen bg-fidaro-green-light/30">
      <header className="bg-white border-b border-fidaro-green-light px-6 md:px-10 py-5 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-fidaro-text-dark">Fidaro · Admin</h1>
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
          <button
            data-testid="tab-leads"
            onClick={() => setTab("leads")}
            className={`px-5 py-2 rounded-full text-sm font-medium ${
              tab === "leads" ? "bg-fidaro-green text-white" : "bg-white text-fidaro-text-dark"
            }`}
          >
            Leads ({leads.length})
          </button>
          <button
            data-testid="tab-payments"
            onClick={() => setTab("payments")}
            className={`px-5 py-2 rounded-full text-sm font-medium ${
              tab === "payments" ? "bg-fidaro-green text-white" : "bg-white text-fidaro-text-dark"
            }`}
          >
            Betalingen ({payments.length})
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-fidaro-green" />
          </div>
        )}

        {!loading && tab === "leads" && (
          <>
            <div className="mb-6 bg-white rounded-2xl border border-fidaro-green-light p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl text-fidaro-text-dark">
                    Handmatige lead toevoegen
                  </h2>
                  <p className="text-sm text-fidaro-text-muted mt-1">
                    Voeg zelf een lead toe met een gekozen datum en tijd.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowManualLeadForm((v) => !v)}
                  className="inline-flex items-center justify-center gap-2 bg-fidaro-green hover:bg-fidaro-green-dark text-white rounded-xl px-5 py-3 text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {showManualLeadForm ? "Formulier sluiten" : "Lead toevoegen"}
                </button>
              </div>

              {showManualLeadForm && (
                <form onSubmit={createManualLead} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={manualLead.name}
                    onChange={(e) => updateManualLead("name", e.target.value)}
                    placeholder="Naam *"
                    className="bg-fidaro-green-light/30 border border-fidaro-green-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fidaro-green"
                    required
                  />

                  <input
                    type="email"
                    value={manualLead.email}
                    onChange={(e) => updateManualLead("email", e.target.value)}
                    placeholder="E-mail *"
                    className="bg-fidaro-green-light/30 border border-fidaro-green-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fidaro-green"
                    required
                  />

                  <input
                    type="text"
                    value={manualLead.phone}
                    onChange={(e) => updateManualLead("phone", e.target.value)}
                    placeholder="Telefoon"
                    className="bg-fidaro-green-light/30 border border-fidaro-green-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fidaro-green"
                  />

                  <input
                    type="text"
                    value={manualLead.property_address}
                    onChange={(e) => updateManualLead("property_address", e.target.value)}
                    placeholder="Adres"
                    className="bg-fidaro-green-light/30 border border-fidaro-green-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fidaro-green"
                  />

                  <select
                    value={manualLead.role}
                    onChange={(e) => updateManualLead("role", e.target.value)}
                    className="bg-fidaro-green-light/30 border border-fidaro-green-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fidaro-green"
                  >
                    <option value="">Rol kiezen</option>
                    <option value="owner">Eigenaar</option>
                    <option value="buyer">Koper</option>
                  </select>

                  <select
                    value={manualLead.service}
                    onChange={(e) => updateManualLead("service", e.target.value)}
                    className="bg-fidaro-green-light/30 border border-fidaro-green-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fidaro-green"
                  >
                    <option value="">Dienst kiezen</option>
                    <option value="quickscan">Quickscan</option>
                    <option value="investment_plan">Investment Plan</option>
                    <option value="consult">Consult</option>
                  </select>

                  <input
                    type="text"
                    value={manualLead.construction_year}
                    onChange={(e) => updateManualLead("construction_year", e.target.value)}
                    placeholder="Bouwjaar"
                    className="bg-fidaro-green-light/30 border border-fidaro-green-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fidaro-green"
                  />

                  <input
                    type="text"
                    value={manualLead.woz_value}
                    onChange={(e) => updateManualLead("woz_value", e.target.value)}
                    placeholder="WOZ-waarde"
                    className="bg-fidaro-green-light/30 border border-fidaro-green-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fidaro-green"
                  />

                  <label className="md:col-span-2 text-sm text-fidaro-text-muted">
                    Datum en tijd
                    <input
                      type="datetime-local"
                      value={manualLead.created_at}
                      onChange={(e) => updateManualLead("created_at", e.target.value)}
                      className="mt-2 w-full bg-fidaro-green-light/30 border border-fidaro-green-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fidaro-green"
                    />
                  </label>

                  <textarea
                    value={manualLead.message}
                    onChange={(e) => updateManualLead("message", e.target.value)}
                    placeholder="Bericht"
                    rows="3"
                    className="md:col-span-2 bg-fidaro-green-light/30 border border-fidaro-green-light rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-fidaro-green"
                  />

                  <label className="md:col-span-2 flex items-center gap-3 text-sm text-fidaro-text-dark">
                    <input
                      type="checkbox"
                      checked={manualLead.agreed_to_price}
                      onChange={(e) => updateManualLead("agreed_to_price", e.target.checked)}
                      className="w-4 h-4"
                    />
                    Akkoord met prijs
                  </label>

                  <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={savingLead}
                      className="inline-flex items-center justify-center gap-2 bg-fidaro-green hover:bg-fidaro-green-dark disabled:opacity-60 text-white rounded-xl px-6 py-3 text-sm font-medium transition-colors"
                    >
                      {savingLead && <Loader2 className="w-4 h-4 animate-spin" />}
                      Lead opslaan
                    </button>

                    <button
                      type="button"
                      onClick={() => setManualLead(emptyManualLead)}
                      className="bg-white border border-fidaro-green-light text-fidaro-text-dark rounded-xl px-6 py-3 text-sm font-medium"
                    >
                      Leegmaken
                    </button>
                  </div>
                </form>
              )}
            </div>

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
                      <th className="px-4 py-3">Bron</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((l, i) => (
                      <tr key={l.id || i} className="border-t border-fidaro-green-light/60">
                        <td className="px-4 py-3 text-fidaro-text-muted">
                          {new Date(l.created_at).toLocaleString()}
                        </td>
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
                        <td className="px-4 py-3 text-xs text-fidaro-text-muted">{l.source}</td>
                      </tr>
                    ))}
                    {leads.length === 0 && (
                      <tr>
                        <td colSpan="8" className="px-4 py-8 text-center text-fidaro-text-muted">
                          Nog geen leads.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

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
                      <td className="px-4 py-3 text-fidaro-text-muted">
                        {new Date(p.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        €{p.amount} {p.currency?.toUpperCase()}
                      </td>
                      <td className="px-4 py-3">{p.package_id}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs ${
                            p.payment_status === "paid"
                              ? "bg-fidaro-green text-white"
                              : "bg-fidaro-silver/30 text-fidaro-text-dark"
                          }`}
                        >
                          {p.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{p.metadata?.lead_email}</td>
                      <td className="px-4 py-3 text-xs text-fidaro-text-muted truncate max-w-[180px]">
                        {p.session_id}
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-fidaro-text-muted">
                        Nog geen betalingen.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}