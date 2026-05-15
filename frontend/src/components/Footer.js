import { Link } from "react-router-dom";
import { useLang } from "../contexts/LanguageContext";

const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_35e0d8c8-8484-434c-b0cb-1a5cfc9d3012/artifacts/p4sighyv_Untitled%20design%20%2811%29.png";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer
      data-testid="site-footer"
      className="bg-fidaro-darker fidaro-grain text-white pt-20 pb-10 relative"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative">
        <div className="grid md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Fidaro Vastgoed" className="h-10 w-10 object-contain" />
              <span className="font-serif text-2xl">
                fidaro <span className="text-fidaro-green">vastgoed</span>
              </span>
            </div>
            <p className="mt-5 text-white/60 font-serif italic text-2xl leading-snug max-w-sm">
              {t.footer.tagline}
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-widest text-fidaro-silver">Navigatie</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href="#problem" className="text-white/70 hover:text-white">
                  {t.nav.problem}
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-white/70 hover:text-white">
                  {t.nav.pricing}
                </a>
              </li>
              <li>
                <a href="#faq" className="text-white/70 hover:text-white">
                  {t.nav.faq}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-white/70 hover:text-white">
                  {t.nav.contact}
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-xs uppercase tracking-widest text-fidaro-silver">Contact</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="mailto:fidarovastgoed@gmail.com"
                  data-testid="footer-email"
                  className="text-white/70 hover:text-white"
                >
                  fidarovastgoed@gmail.com
                </a>
              </li>
              <li className="text-white/50">Nederland</li>
            </ul>
            <div className="mt-6 flex gap-4 text-xs">
              <Link to="/privacy" data-testid="footer-privacy" className="text-white/60 hover:text-white">
                {t.footer.privacy}
              </Link>
              <Link to="/terms" data-testid="footer-terms" className="text-white/60 hover:text-white">
                {t.footer.terms}
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 text-xs text-white/40 leading-relaxed max-w-4xl">
          {t.footer.disclaimer}
        </div>
        <div className="mt-6 text-xs text-white/30 flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} Fidaro Vastgoed. {t.footer.rights}</span>
          <span>KvK & BTW: in registratie</span>
        </div>
      </div>
    </footer>
  );
}
