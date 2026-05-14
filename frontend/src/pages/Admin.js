import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Lock, Loader2, LogOut } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("fidaro_admin_token") || "");
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("leads");

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

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-fidaro-darker fidaro-grain">
        <form
          onSubmit={login}
          data-testid="admin-login-form"
          className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full"
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
        <div className="flex gap-2 mb-6">
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
                      <td className="px-4 py-3">{l.service}</td>
                      <td className="px-4 py-3 text-xs text-fidaro-text-muted">{l.source}</td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-fidaro-text-muted">
                        Nog geen leads.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
