import { useLang } from "../../contexts/LanguageContext";

export default function ProcessSection() {
  const { t } = useLang();
  return (
    <section id="process" data-testid="process-section" className="py-24 md:py-32 bg-fidaro-green-light/40">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl">
          <div className="text-xs uppercase tracking-[0.2em] text-fidaro-green font-semibold">
            {t.process.label}
          </div>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl text-fidaro-text-dark leading-tight">
            {t.process.title}
          </h2>
        </div>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {t.process.steps.map((s, i) => (
            <div
              key={i}
              data-testid={`process-step-${i}`}
              className="relative rounded-2xl bg-white border border-fidaro-green-light p-7 hover:border-fidaro-green/40 transition-all"
            >
              <div className="font-serif text-6xl text-fidaro-green/30 leading-none">{s.n}</div>
              <h3 className="mt-4 font-serif text-2xl text-fidaro-text-dark">{s.t}</h3>
              <p className="mt-3 text-sm text-fidaro-text-muted leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
