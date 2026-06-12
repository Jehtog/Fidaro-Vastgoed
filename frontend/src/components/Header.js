import { Link } from "react-router-dom";
import { useLang } from "../contexts/LanguageContext";
import { Menu, X, Calculator } from "lucide-react";
import { useState, useEffect } from "react";

const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_35e0d8c8-8484-434c-b0cb-1a5cfc9d3012/artifacts/p4sighyv_Untitled%20design%20%2811%29.png";

export default function Header() {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { id: "problem", label: t.nav.problem },
    { id: "solution", label: t.nav.solution },
    { id: "pricing", label: t.nav.pricing },
    { id: "process", label: t.nav.process },
    { id: "faq", label: t.nav.faq },
    { id: "contact", label: t.nav.contact },
  ];

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-fidaro-green-light"
          : "bg-white/70 backdrop-blur"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-28 flex items-center justify-between">
        <Link to="/" data-testid="header-logo" className="flex items-center gap-3 text-fidaro-ink">
          <img src={LOGO_URL} alt="Fidaro Vastgoed" className="h-20 w-20 object-contain" />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {nav.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              data-testid={`nav-${n.id}`}
              className="text-sm font-medium text-fidaro-text-muted hover:text-fidaro-green-dark transition-colors"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div
            data-testid="lang-switcher"
            className="hidden md:flex items-center text-[11px] font-medium border border-fidaro-green/20 rounded-full overflow-hidden"
          >
            <button
              data-testid="lang-nl-btn"
              onClick={() => setLang("nl")}
              className={`px-2.5 py-1.5 transition-colors ${
                lang === "nl" ? "bg-fidaro-green text-white" : "text-fidaro-text-muted hover:text-fidaro-ink"
              }`}
            >
              NL
            </button>
            <button
              data-testid="lang-en-btn"
              onClick={() => setLang("en")}
              className={`px-2.5 py-1.5 transition-colors ${
                lang === "en" ? "bg-fidaro-green text-white" : "text-fidaro-text-muted hover:text-fidaro-ink"
              }`}
            >
              EN
            </button>
          </div>

          <Link
            to="/wws-calculator"
            data-testid="header-calculator-link"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-fidaro-green-dark hover:text-fidaro-ink transition-colors"
          >
            <Calculator className="w-4 h-4" />
            {t.nav.calculator}
          </Link>

          <a
            href="#pricing"
            data-testid="header-cta"
            className="hidden md:inline-flex bg-fidaro-green hover:bg-fidaro-green-dark text-white text-sm font-semibold rounded-xl px-5 py-2.5 transition-colors shadow-[0_4px_18px_rgba(79,111,87,0.25)]"
          >
            {t.nav.cta}
          </a>

          <button
            data-testid="mobile-menu-btn"
            className="lg:hidden p-2 text-fidaro-ink"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-fidaro-green-light px-6 py-6 space-y-3">
          {nav.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={() => setOpen(false)}
              data-testid={`nav-mobile-${n.id}`}
              className="block text-fidaro-ink hover:text-fidaro-green text-sm"
            >
              {n.label}
            </a>
          ))}
          <div className="flex items-center gap-2 pt-3">
            <button data-testid="lang-mobile-nl" onClick={() => setLang("nl")} className={`px-3 py-1.5 text-xs rounded-full ${lang === "nl" ? "bg-fidaro-green text-white" : "bg-fidaro-green-light text-fidaro-green-dark"}`}>NL</button>
            <button data-testid="lang-mobile-en" onClick={() => setLang("en")} className={`px-3 py-1.5 text-xs rounded-full ${lang === "en" ? "bg-fidaro-green text-white" : "bg-fidaro-green-light text-fidaro-green-dark"}`}>EN</button>
          </div>
          <a href="#pricing" onClick={() => setOpen(false)} data-testid="header-cta-mobile" className="block bg-fidaro-green text-white text-center rounded-xl px-5 py-3 text-sm font-semibold">{t.nav.cta}</a>
          <Link to="/wws-calculator" onClick={() => setOpen(false)} data-testid="header-calculator-mobile" className="block border border-fidaro-green/30 text-fidaro-green-dark text-center rounded-xl px-5 py-3 text-sm font-semibold">{t.nav.calculator}</Link>
        </div>
      )}
    </header>
  );
}
