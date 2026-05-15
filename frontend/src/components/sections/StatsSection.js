import { useLang } from "../../contexts/LanguageContext";

export default function StatsSection() {
  const { t } = useLang();
  return (
    <section data-testid="stats-section" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl">
          <div className="inline-block text-[11px] uppercase tracking-[0.22em] text-fidaro-green font-semibold px-3 py-1 rounded-full bg-fidaro-green-light">
            {t.stats.label}
          </div>
          <h2 className="mt-6 font-display text-4xl md:text-6xl text-fidaro-ink leading-[1.02]">
            {t.stats.title}
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-4">
          {t.stats.items.map((s, i) => (
            <div
              key={i}
              data-testid={`stat-${i}`}
              className="group relative rounded-3xl bg-fidaro-ink text-white p-8 overflow-hidden hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-fidaro-green/30 rounded-full blur-3xl group-hover:bg-fidaro-green-bright/40 transition-colors" />
              <div className="relative">
                <div className="text-[10px] uppercase tracking-[0.22em] text-fidaro-green-bright font-mono">
                  STAT 0{i + 1}
                </div>
                <div className="mt-4 font-display text-7xl md:text-8xl tabular leading-none">
                  {s.value}
                </div>
                <div className="mt-5 text-sm text-white/65 leading-relaxed">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-4xl rounded-3xl border border-fidaro-green-light p-6 md:p-8 bg-fidaro-green-light/40">
          <p className="text-lg md:text-xl text-fidaro-ink leading-snug">
            "{t.stats.interpretation}"
          </p>
        </div>
      </div>
    </section>
  );
}
