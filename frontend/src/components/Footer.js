import { Link } from "react-router-dom";
import { useLang } from "../contexts/LanguageContext";

const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_35e0d8c8-8484-434c-b0cb-1a5cfc9d3012/artifacts/p4sighyv_Untitled%20design%20%2811%29.png";

export default function Footer() {
  const { t, lang } = useLang();
  return (
    <footer
      data-testid="site-footer"
      className="bg-fidaro-green-light/40 border-t border-fidaro-green-light text-fidaro-ink pt-20 pb-10 relative"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
        <div className="grid md:grid-cols-12 gap-10 pb-12 border-b border-fidaro-green/15">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Fidaro Vastgoed" className="h-10 w-10 object-contain" />
              <span className="font-display text-2xl tracking-tight text-fidaro-ink">
                fidaro <span className="text-fidaro-green">vastgoed</span>
              </span>
            </div>
            <p className="mt-6 text-fidaro-text-muted text-xl font-display tracking-tight max-w-sm leading-tight">
              {t.footer.tagline}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-fidaro-green-dark font-mono px-3 py-1.5 rounded-full bg-white border border-fidaro-green/20">
              <span className="w-1.5 h-1.5 rounded-full bg-fidaro-green pulse-soft" />
              {lang === "nl" ? "Quick-Scan beschikbaar" : "Quick-Scan available"}
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[10px] uppercase tracking-[0.22em] text-fidaro-text-muted font-mono">
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
                  <a href={h} className="text-fidaro-text-muted hover:text-fidaro-green-dark transition-colors">{l}</a>
                </li>
              ))}
              <li>
                <Link to="/wws-calculator" className="text-fidaro-text-muted hover:text-fidaro-green-dark transition-colors">
                  {t.nav.calculator}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-[10px] uppercase tracking-[0.22em] text-fidaro-text-muted font-mono">
              Contact
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href="mailto:fidarovastgoed@gmail.com"
                  data-testid="footer-email"
                  className="text-fidaro-green-dark hover:text-fidaro-ink font-medium transition-colors"
                >
                  fidarovastgoed@gmail.com
                </a>
              </li>
              <li className="text-fidaro-text-muted">Nederland</li>
            </ul>
            <div className="mt-6 flex gap-3 text-xs">
              <Link to="/privacy" data-testid="footer-privacy" className="rounded-full border border-fidaro-green/20 px-3 py-1 text-fidaro-text-muted hover:bg-white hover:text-fidaro-ink transition-colors">
                {t.footer.privacy}
              </Link>
              <Link to="/terms" data-testid="footer-terms" className="rounded-full border border-fidaro-green/20 px-3 py-1 text-fidaro-text-muted hover:bg-white hover:text-fidaro-ink transition-colors">
                {t.footer.terms}
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 text-xs text-fidaro-text-muted leading-relaxed max-w-4xl">
          {t.footer.disclaimer}
        </div>
        <div className="mt-6 text-xs text-fidaro-text-muted/80 flex flex-wrap justify-between gap-2 font-mono">
          <span>© {new Date().getFullYear()} FIDARO VASTGOED · {t.footer.rights}</span>
          <span>KVK & VAT · IN REGISTRATION</span>
        </div>
      </div>
    </footer>
  );
}
