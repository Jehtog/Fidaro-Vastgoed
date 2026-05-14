import { useLang } from "../../contexts/LanguageContext";

export default function StatsSection() {
  const { t } = useLang();
  return (
    <section data-testid="stats-section" className="py-24 md:py-32 bg-fidaro-green-light/40">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.2em] text-fidaro-green font-semibold">
            {t.stats.label}
          </div>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl text-fidaro-text-dark leading-tight">
            {t.stats.title}
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {t.stats.items.map((s, i) => (
            <div
              key={i}
              data-testid={`stat-${i}`}
              className="rounded-2xl bg-white p-10 border border-fidaro-green-light hover:border-fidaro-green/40 transition-colors"
            >
              <div className="font-serif text-7xl md:text-8xl text-fidaro-green-dark leading-none">
                {s.value}
              </div>
              <div className="mt-5 text-fidaro-text-muted text-sm leading-relaxed">{s.label}</div>
            </div>
          ))}
        </div>

        <p className="mt-12 max-w-3xl font-serif italic text-xl md:text-2xl text-fidaro-text-dark leading-snug">
          "{t.stats.interpretation}"
        </p>
      </div>
    </section>
  );
}
