import { useLang } from "../../contexts/LanguageContext";
import { ArrowRight, ShieldCheck, Check } from "lucide-react";

const HERO_IMG =
  "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwxfHxhbXN0ZXJkYW0lMjBjYW5hbHxlbnwwfHx8fDE3Nzg4MDIxMTZ8MA&ixlib=rb-4.1.0&q=85";

export default function Hero() {
  const { t, lang } = useLang();
  return (
    <section
      data-testid="hero-section"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-fidaro-green-light/30"
    >
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-fidaro-green-light/50 via-white to-white" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-12 items-center">
        {/* Copy */}
        <div className="lg:col-span-7 animate-fade-up">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-fidaro-green-dark font-semibold px-3 py-1.5 rounded-full bg-white border border-fidaro-green/15">
            <span className="w-1.5 h-1.5 rounded-full bg-fidaro-green" />
            {t.hero.eyebrow}
          </div>

          <h1 className="mt-7 font-display text-4xl sm:text-5xl lg:text-[64px] leading-[1.04] text-fidaro-ink tracking-tight">
            {t.hero.title}
          </h1>

          <p className="mt-6 text-lg text-fidaro-text-muted leading-relaxed max-w-xl">
            {t.hero.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#pricing"
              data-testid="hero-primary-cta"
              className="group inline-flex items-center gap-2 bg-fidaro-green hover:bg-fidaro-green-dark text-white rounded-xl px-7 py-3.5 text-sm font-semibold tracking-tight transition-all shadow-[0_6px_22px_rgba(79,111,87,0.25)] hover:shadow-[0_10px_28px_rgba(79,111,87,0.35)] hover:-translate-y-0.5"
            >
              {t.hero.primary}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#product"
              data-testid="hero-secondary-cta"
              className="inline-flex items-center gap-2 border border-fidaro-green/25 hover:border-fidaro-green text-fidaro-green-dark hover:bg-fidaro-green-light rounded-xl px-7 py-3.5 text-sm font-semibold tracking-tight transition-all"
            >
              {t.hero.secondary}
            </a>
          </div>

          <div className="mt-9 flex items-center gap-3 text-sm text-fidaro-text-muted">
            <ShieldCheck className="w-4 h-4 text-fidaro-green" />
            <span>{t.hero.trust}</span>
          </div>
        </div>

        {/* Visual: property image with light report card overlay */}
        <div
          className="lg:col-span-5 animate-fade-up"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="relative">
            <div className="absolute -top-8 -left-8 w-44 h-44 bg-fidaro-green-light rounded-full blur-3xl opacity-70" />
            <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_60px_-20px_rgba(15,20,16,0.22)] border border-white/60">
              <img
                src={HERO_IMG}
                alt="Dutch residential real estate"
                className="w-full h-[480px] object-cover"
              />
              {/* Soft sage overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-fidaro-green-dark/35 via-transparent to-transparent" />

              {/* Floating advisory card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl rounded-2xl p-5 border border-white/70 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-fidaro-green-dark font-semibold">
                    {lang === "nl" ? "Quick-Scan rapport" : "Quick-Scan report"}
                  </div>
                  <div className="text-[10px] text-fidaro-text-muted font-medium">
                    € 99
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  {[
                    { l: lang === "nl" ? "WWS" : "WWS", v: "184.5" },
                    { l: lang === "nl" ? "Huur" : "Rent", v: "€ 1.380" },
                    { l: "ROI", v: "4.8%" },
                  ].map((m) => (
                    <div key={m.l} className="rounded-lg bg-fidaro-green-light/60 px-2.5 py-2">
                      <div className="text-[9px] uppercase tracking-widest text-fidaro-green-dark/80">
                        {m.l}
                      </div>
                      <div className="mt-0.5 text-sm font-bold text-fidaro-ink tabular">
                        {m.v}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-fidaro-green-dark">
                  <Check className="w-3.5 h-3.5" />
                  {lang === "nl"
                    ? "Onafhankelijk · WWS · ROI · Box 3"
                    : "Independent · WWS · ROI · Box 3"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
