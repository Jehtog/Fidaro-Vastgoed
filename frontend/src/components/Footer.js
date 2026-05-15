import { Link } from "react-router-dom";
import { useLang } from "../contexts/LanguageContext";

const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_35e0d8c8-8484-434c-b0cb-1a5cfc9d3012/artifacts/p4sighyv_Untitled%20design%20%2811%29.png";

export default function Footer() {
  const { t, lang } = useLang();
  return (
    <footer
      data-testid="site-footer"
      className="bg-fidaro-darker fidaro-grain text-white pt-20 pb-10 relative overflow-hidden"
    >
      <div className="absolute -top-32 right-0 w-[400px] h-[400px] bg-fidaro-green/15 rounded-full blur-[100px]" />
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
        <div className="grid md:grid-cols-12 gap-10 pb-12 border-b border-white/8">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Fidaro Vastgoed" className="h-10 w-10 object-contain" />
              <span className="font-display text-2xl tracking-tight">
                fidaro <span className="text-fidaro-green-bright">vastgoed</span>
              </span>
            </div>
            <p className="mt-6 text-white/60 text-2xl font-display tracking-tight max-w-sm leading-tight">
              {t.footer.tagline}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-fidaro-green-bright font-mono px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-fidaro-green-bright pulse-soft" />
              {lang === "nl" ? "Live · Quick-Scan beschikbaar" : "Live · Quick-Scan available"}
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[10px] uppercase tracking-[0.22em] text-white/40 font-mono">
              {lang === "nl" ? "Navigatie" : "Navigation"}
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ["#problem", t.nav.problem],
                ["#pricing", t.nav.pricing],
                ["#faq", t.nav.faq],
                ["#contact", t.nav.contact],
              ].map(([h, l]) => (
                <li key={h}>
                  <a href={h} className="text-white/70 hover:text-white">{l}</a>
                </li>
              ))}
              <li>
                <Link to="/wws-calculator" className="text-white/70 hover:text-white">
                  {t.nav.calculator}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-[10px] uppercase tracking-[0.22em] text-white/40 font-mono">
              Contact
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href="mailto:fidarovastgoed@gmail.com"
                  data-testid="footer-email"
                  className="text-white/70 hover:text-white fidaro-link-underline"
                >
                  fidarovastgoed@gmail.com
                </a>
              </li>
              <li className="text-white/40">Nederland</li>
            </ul>
            <div className="mt-6 flex gap-3 text-xs">
              <Link to="/privacy" data-testid="footer-privacy" className="rounded-full border border-white/10 px-3 py-1 text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                {t.footer.privacy}
              </Link>
              <Link to="/terms" data-testid="footer-terms" className="rounded-full border border-white/10 px-3 py-1 text-white/60 hover:bg-white/5 hover:text-white transition-colors">
                {t.footer.terms}
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 text-xs text-white/35 leading-relaxed max-w-4xl">
          {t.footer.disclaimer}
        </div>
        <div className="mt-6 text-xs text-white/25 flex flex-wrap justify-between gap-2 font-mono">
          <span>© {new Date().getFullYear()} FIDARO VASTGOED · {t.footer.rights}</span>
          <span>KVK & VAT · IN REGISTRATION</span>
        </div>
      </div>
    </footer>
  );
}
