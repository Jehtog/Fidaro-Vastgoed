import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { legal } from "../legal";
import Footer from "../components/Footer";

export default function LegalPage({ kind }) {
  const { lang, setLang } = useLang();
  const content = legal[kind][lang] || legal[kind].nl;

  return (
    <div data-testid={`legal-page-${kind}`} className="bg-white min-h-screen">
      <header className="border-b border-fidaro-green-light bg-white sticky top-0 z-30 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <Link
            to="/"
            data-testid="legal-back-link"
            className="inline-flex items-center gap-2 text-sm text-fidaro-text-dark hover:text-fidaro-green transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-serif text-lg">
              fidaro <span className="text-fidaro-green">vastgoed</span>
            </span>
          </Link>
          <div className="flex items-center text-xs border border-fidaro-green/30 rounded-full overflow-hidden">
            <button
              data-testid="legal-lang-nl"
              onClick={() => setLang("nl")}
              className={`px-3 py-1.5 transition-colors ${
                lang === "nl"
                  ? "bg-fidaro-green text-white"
                  : "text-fidaro-text-dark hover:bg-fidaro-green-light"
              }`}
            >
              NL
            </button>
            <button
              data-testid="legal-lang-en"
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 transition-colors ${
                lang === "en"
                  ? "bg-fidaro-green text-white"
                  : "text-fidaro-text-dark hover:bg-fidaro-green-light"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="text-xs uppercase tracking-[0.2em] text-fidaro-green font-semibold">
          {content.updated}
        </div>
        <h1 className="mt-3 font-serif text-5xl md:text-6xl text-fidaro-text-dark leading-tight">
          {content.title}
        </h1>
        <p className="mt-6 text-lg text-fidaro-text-muted leading-relaxed">{content.intro}</p>

        <div className="mt-14 space-y-10">
          {content.sections.map((s, i) => (
            <section key={i} data-testid={`legal-section-${i}`}>
              <h2 className="font-serif text-2xl md:text-3xl text-fidaro-text-dark leading-snug">
                {s.h}
              </h2>
              {s.p && (
                <p className="mt-4 text-fidaro-text-muted leading-relaxed">{s.p}</p>
              )}
              {s.list && (
                <ul className="mt-4 space-y-2 list-disc pl-5 marker:text-fidaro-green">
                  {s.list.map((it, j) => (
                    <li key={j} className="text-fidaro-text-muted leading-relaxed">
                      {it}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-16 p-6 rounded-2xl bg-fidaro-green-light/60 border border-fidaro-green/20 text-sm text-fidaro-green-dark">
          {lang === "nl" ? "Vragen? Neem contact op via " : "Questions? Reach us at "}
          <a
            href="mailto:fidarovastgoed@gmail.com"
            className="font-medium underline underline-offset-2"
          >
            fidarovastgoed@gmail.com
          </a>
          .
        </div>
      </main>

      <Footer />
    </div>
  );
}
