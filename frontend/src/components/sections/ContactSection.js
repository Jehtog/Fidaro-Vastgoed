import { useLang } from "../../contexts/LanguageContext";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ContactSection() {
  const { t, lang } = useLang();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    property_address: "",
    role: "buyer",
    service: "quickscan",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error(lang === "nl" ? "Naam en e-mail verplicht" : "Name and email required");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/leads`, { ...form, language: lang, source: "contact_form" });
      toast.success(t.contact.success);
      setForm({
        name: "",
        email: "",
        phone: "",
        property_address: "",
        role: "buyer",
        service: "quickscan",
        message: "",
      });
    } catch {
      toast.error(t.contact.error);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-fidaro-green focus:ring-2 focus:ring-fidaro-green/20";

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="py-24 md:py-32 bg-fidaro-darker fidaro-grain relative text-white"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10 relative">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-fidaro-green font-semibold">
            {t.contact.label}
          </div>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl text-white leading-tight">
            {t.contact.title}
          </h2>
          <p className="mt-5 text-white/70 text-lg">{t.contact.body}</p>
        </div>

        <form onSubmit={submit} className="mt-12 grid md:grid-cols-2 gap-4" data-testid="contact-form">
          <input
            data-testid="contact-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={t.contact.fields.name}
            className={inputCls}
            required
          />
          <input
            data-testid="contact-email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder={t.contact.fields.email}
            className={inputCls}
            required
          />
          <input
            data-testid="contact-phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder={t.contact.fields.phone}
            className={inputCls}
          />
          <input
            data-testid="contact-address"
            value={form.property_address}
            onChange={(e) => setForm({ ...form, property_address: e.target.value })}
            placeholder={t.contact.fields.address}
            className={inputCls}
          />

          <select
            data-testid="contact-role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className={inputCls}
          >
            <option value="buyer" className="text-fidaro-text-dark">
              {t.contact.fields.role_buyer}
            </option>
            <option value="owner" className="text-fidaro-text-dark">
              {t.contact.fields.role_owner}
            </option>
          </select>

          <select
            data-testid="contact-service"
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
            className={inputCls}
          >
            <option value="quickscan" className="text-fidaro-text-dark">
              {t.contact.fields.service_q}
            </option>
            <option value="investment_plan" className="text-fidaro-text-dark">
              {t.contact.fields.service_p}
            </option>
            <option value="consult" className="text-fidaro-text-dark">
              {t.contact.fields.service_c}
            </option>
          </select>

          <textarea
            data-testid="contact-message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder={t.contact.fields.message}
            rows={5}
            className={`${inputCls} md:col-span-2 resize-none`}
          />

          <button
            type="submit"
            data-testid="contact-submit"
            disabled={loading}
            className="md:col-span-2 mt-2 bg-fidaro-green hover:bg-fidaro-green-dark disabled:opacity-60 text-white rounded-xl px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {t.contact.cta}
          </button>
        </form>
      </div>
    </section>
  );
}
