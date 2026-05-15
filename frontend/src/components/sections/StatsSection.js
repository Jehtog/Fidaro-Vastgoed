import { useLang } from "../../contexts/LanguageContext";

export default function StatsSection() {
  const { t } = useLang();
  return (
    <section data-testid="stats-section" className="py-24 md:py-32 bg-fidaro-green-light/40">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl">
          <div className="inline-block text-[11px] uppercase tracking-[0.22em] text-fidaro-green font-semibold px-3 py-1 rounded-full bg-white">
            {t.stats.label}
          </div>
          <h2 className="mt-6 font-display text-4xl md:text-5xl text-fidaro-ink leading-[1.05]">
            {t.stats.title}
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-5 max-w-5xl">
          {t.stats.items.map((s, i) => (
            <div
              key={i}
              data-testid={`stat-${i}`}
              className="rounded-3xl bg-white border border-fidaro-green-light p-10 hover:border-fidaro-green/40 hover:shadow-[0_8px_30px_rgba(15,20,16,0.06)] transition-all"
            >
              <div className="font-display text-7xl md:text-8xl tabular leading-none text-fidaro-green-dark">
                {s.value}
              </div>
              <div className="mt-6 text-base text-fidaro-text-muted leading-relaxed max-w-md">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 max-w-3xl text-lg text-fidaro-ink leading-relaxed">
          {t.stats.interpretation}
        </p>
      </div>
    </section>
  );
}
