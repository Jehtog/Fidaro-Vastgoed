import { useLang } from "../../contexts/LanguageContext";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ContactSection() {
  const { t, lang } = useLang();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", property_address: "",
    role: "buyer", service: "quickscan", message: "",
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
      setForm({ name: "", email: "", phone: "", property_address: "", role: "buyer", service: "quickscan", message: "" });
    } catch { toast.error(t.contact.error); }
    finally { setLoading(false); }
  };

  const inputCls =
    "w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-fidaro-green-bright focus:ring-2 focus:ring-fidaro-green-bright/20";

  return (
    <section id="contact" data-testid="contact-section" className="py-24 md:py-32 bg-fidaro-darker fidaro-grain relative text-white overflow-hidden">
      <div className="absolute -top-32 left-1/3 w-[500px] h-[500px] bg-fidaro-green/15 rounded-full blur-[120px]" />

      <div className="relative max-w-5xl mx-auto px-6 md:px-10">
        <div className="max-w-2xl">
          <div className="inline-block text-[11px] uppercase tracking-[0.22em] text-fidaro-green-bright font-semibold px-3 py-1 rounded-full bg-white/5 border border-white/10">
            {t.contact.label}
          </div>
          <h2 className="mt-6 font-display text-4xl md:text-6xl leading-[1.02]">{t.contact.title}</h2>
          <p className="mt-5 text-white/65 text-lg">{t.contact.body}</p>
        </div>

        <form onSubmit={submit} className="mt-12 grid md:grid-cols-2 gap-3" data-testid="contact-form">
          <input data-testid="contact-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t.contact.fields.name} className={inputCls} required />
          <input data-testid="contact-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t.contact.fields.email} className={inputCls} required />
          <input data-testid="contact-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={t.contact.fields.phone} className={inputCls} />
          <input data-testid="contact-address" value={form.property_address} onChange={(e) => setForm({ ...form, property_address: e.target.value })} placeholder={t.contact.fields.address} className={inputCls} />
          <select data-testid="contact-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls}>
            <option value="buyer" className="text-fidaro-ink">{t.contact.fields.role_buyer}</option>
            <option value="owner" className="text-fidaro-ink">{t.contact.fields.role_owner}</option>
          </select>
          <select data-testid="contact-service" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className={inputCls}>
            <option value="quickscan" className="text-fidaro-ink">{t.contact.fields.service_q}</option>
            <option value="investment_plan" className="text-fidaro-ink">{t.contact.fields.service_p}</option>
            <option value="consult" className="text-fidaro-ink">{t.contact.fields.service_c}</option>
          </select>
          <textarea data-testid="contact-message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder={t.contact.fields.message} rows={5} className={`${inputCls} md:col-span-2 resize-none`} />
          <button type="submit" data-testid="contact-submit" disabled={loading} className="md:col-span-2 mt-2 group bg-fidaro-green hover:bg-fidaro-green-dark disabled:opacity-60 text-white rounded-full px-7 py-4 font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(79,111,87,0.45)]">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {t.contact.cta}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      </div>
    </section>
  );
}
