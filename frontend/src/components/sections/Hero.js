import { useLang } from "../../contexts/LanguageContext";
import { ArrowRight, ShieldCheck } from "lucide-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwxfHxhbXN0ZXJkYW0lMjBjYW5hbHxlbnwwfHx8fDE3Nzg4MDIxMTZ8MA&ixlib=rb-4.1.0&q=85";

export default function Hero() {
  const { t } = useLang();
  return (
    <section data-testid="hero-section" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-fidaro-green-light/40 via-white to-white" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 animate-fade-up">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-fidaro-green font-semibold mb-6">
            <span className="w-8 h-px bg-fidaro-green" />
            {t.hero.eyebrow}
          </div>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.02] text-fidaro-text-dark tracking-tight">
            {t.hero.title}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-fidaro-text-muted leading-relaxed max-w-2xl">
            {t.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#pricing"
              data-testid="hero-primary-cta"
              className="group inline-flex items-center gap-2 bg-fidaro-green hover:bg-fidaro-green-dark text-white rounded-xl px-7 py-4 font-medium transition-all shadow-lg shadow-fidaro-green/20 hover:shadow-xl hover:-translate-y-0.5"
            >
              {t.hero.primary}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#product"
              data-testid="hero-secondary-cta"
              className="inline-flex items-center gap-2 border-2 border-fidaro-green/30 hover:border-fidaro-green text-fidaro-green hover:bg-fidaro-green-light rounded-xl px-7 py-4 font-medium transition-all"
            >
              {t.hero.secondary}
            </a>
          </div>
          <div className="mt-10 flex items-center gap-3 text-sm text-fidaro-text-muted">
            <ShieldCheck className="w-5 h-5 text-fidaro-green" />
            <span>{t.hero.trust}</span>
          </div>
        </div>

        <div className="lg:col-span-5 relative animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-fidaro-green-light rounded-full blur-3xl opacity-70" />
            <div className="relative rounded-3xl overflow-hidden border border-fidaro-green-light shadow-2xl shadow-fidaro-green/10">
              <img src={HERO_IMG} alt="Amsterdam canal houses" className="w-full h-[520px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-fidaro-darker/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-2xl p-5 border border-white/40">
                <div className="text-xs uppercase tracking-widest text-fidaro-green font-semibold">
                  Quick-Scan voorbeeld
                </div>
                <div className="mt-2 text-sm text-fidaro-text-dark">
                  WWS-positie ✓ &nbsp;·&nbsp; Huurpotentieel ✓ &nbsp;·&nbsp; Risicoprofiel ✓
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
