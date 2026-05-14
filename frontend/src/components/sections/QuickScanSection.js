import { useLang } from "../../contexts/LanguageContext";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function QuickScanSection() {
  const { t, lang } = useLang();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", property_address: "" });

  const handleCheckout = async () => {
    if (!form.name || !form.email) {
      toast.error(lang === "nl" ? "Naam en e-mail zijn verplicht" : "Name and email are required");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/payments/v1/checkout/session`, {
        package_id: "quickscan",
        origin_url: window.location.origin,
        ...form,
        language: lang,
      });
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("No checkout URL");
        setLoading(false);
      }
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Checkout failed");
      setLoading(false);
    }
  };

  return (
    <section data-testid="quickscan-section" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-6">
          <div className="text-xs uppercase tracking-[0.2em] text-fidaro-green font-semibold">
            {t.quickscan.label}
          </div>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl text-fidaro-text-dark leading-tight">
            {t.quickscan.title}
          </h2>
          <p className="mt-6 text-lg text-fidaro-text-muted leading-relaxed max-w-lg">
            {t.quickscan.body}
          </p>

          <ul className="mt-8 grid sm:grid-cols-2 gap-3">
            {t.quickscan.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" data-testid={`qs-feature-${i}`}>
                <Check className="w-4 h-4 mt-0.5 text-fidaro-green flex-shrink-0" />
                <span className="text-fidaro-text-dark">{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 p-5 bg-fidaro-green-light/60 rounded-xl border border-fidaro-green/20 text-sm text-fidaro-green-dark italic max-w-lg">
            {t.quickscan.note}
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="bg-fidaro-darker rounded-3xl p-8 md:p-10 text-white shadow-2xl">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-6xl">€99</span>
              <span className="text-white/60 text-sm">{lang === "nl" ? "eenmalig" : "one-time"}</span>
            </div>
            <p className="mt-3 text-white/70 text-sm max-w-md">
              {lang === "nl"
                ? "Krijg binnen 48 uur een eerste, scherpe panddoorlichting. Veilig betalen via Stripe."
                : "Receive a sharp first review of the property within 48 hours. Secure payment via Stripe."}
            </p>

            <div className="mt-8 space-y-3">
              <input
                data-testid="qs-inline-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t.contact.fields.name}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-fidaro-green"
              />
              <input
                data-testid="qs-inline-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={t.contact.fields.email}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-fidaro-green"
              />
              <input
                data-testid="qs-inline-address"
                value={form.property_address}
                onChange={(e) => setForm({ ...form, property_address: e.target.value })}
                placeholder={t.contact.fields.address}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-fidaro-green"
              />
            </div>

            <button
              data-testid="qs-inline-pay-btn"
              onClick={handleCheckout}
              disabled={loading}
              className="mt-6 w-full bg-fidaro-green hover:bg-fidaro-green-dark disabled:opacity-60 text-white rounded-xl px-6 py-4 font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {t.quickscan.cta}
            </button>
            <p className="mt-3 text-xs text-white/40 text-center">
              {lang === "nl" ? "Veilige betaling via" : "Secure payment via"} Stripe · SSL
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
