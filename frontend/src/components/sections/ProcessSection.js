import { useLang } from "../../contexts/LanguageContext";

export default function ProcessSection() {
  const { t } = useLang();
  return (
    <section id="process" data-testid="process-section" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl">
          <div className="inline-block text-[11px] uppercase tracking-[0.22em] text-fidaro-green font-semibold px-3 py-1 rounded-full bg-fidaro-green-light">
            {t.process.label}
          </div>
          <h2 className="mt-6 font-display text-4xl md:text-6xl text-fidaro-ink leading-[1.02]">
            {t.process.title}
          </h2>
        </div>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.process.steps.map((s, i) => (
            <div
              key={i}
              data-testid={`process-step-${i}`}
              className="relative rounded-3xl border border-fidaro-green-light p-7 hover:border-fidaro-green/40 hover:shadow-[0_8px_30px_rgba(15,20,16,0.06)] transition-all bg-white"
            >
              <div className="font-mono text-xs text-fidaro-green tracking-widest">{s.n}</div>
              <h3 className="mt-3 text-xl font-bold text-fidaro-ink tracking-tight">{s.t}</h3>
              <p className="mt-2 text-sm text-fidaro-text-muted leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
