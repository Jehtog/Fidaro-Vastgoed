import { useLang } from "../../contexts/LanguageContext";
import { CheckCircle2 } from "lucide-react";

const STEPS = {
  nl: [
    { tag: "Q1 2026", title: "Quick-Scan MVP", desc: "Lichte panddoorlichting voor €99 — toetst betalingsbereidheid.", status: "active" },
    { tag: "Q2 2026", title: "Investment Plan", desc: "Volledig validatierapport met scenario's voor €750.", status: "next" },
    { tag: "Q3 2026", title: "Partnerships", desc: "Samenwerking met hypotheekadviseurs, juristen en notarissen.", status: "future" },
    { tag: "Q4 2026", title: "Belgium Study", desc: "Marktverkenning Vlaanderen voor uitbreiding van de validatie­dienst.", status: "future" },
  ],
  en: [
    { tag: "Q1 2026", title: "Quick-Scan", desc: "€99 lighter property review — independent first validation.", status: "active" },
    { tag: "Q2 2026", title: "Investment Plan", desc: "Full €750 validation report with scenarios.", status: "next" },
    { tag: "Q3 2026", title: "Partnerships", desc: "Collaboration with mortgage advisors, lawyers, notaries.", status: "future" },
    { tag: "Q4 2026", title: "Belgium Study", desc: "Market study Flanders to expand the validation service.", status: "future" },
  ],
};

const TITLES = {
  nl: { label: "Roadmap", title: "Ons pad naar onafhankelijk gevalideerd vastgoedadvies" },
  en: { label: "Roadmap", title: "Our path to independent, validated real-estate advisory" },
};

export default function RoadmapSection() {
  const { lang } = useLang();
  const steps = STEPS[lang] || STEPS.nl;
  const T = TITLES[lang] || TITLES.nl;
  return (
    <section data-testid="roadmap-section" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl">
          <div className="inline-block text-[11px] uppercase tracking-[0.22em] text-fidaro-green font-semibold px-3 py-1 rounded-full bg-fidaro-green-light">
            {T.label}
          </div>
          <h2 className="mt-6 font-display text-4xl md:text-6xl text-fidaro-ink leading-[1.02]">
            {T.title}
          </h2>
        </div>

        <div className="mt-16 relative">
          <div className="absolute top-6 left-0 right-0 h-px bg-fidaro-green-light hidden md:block" />
          <div className="grid md:grid-cols-4 gap-5 md:gap-3">
            {steps.map((s, i) => (
              <div key={i} data-testid={`roadmap-step-${i}`} className="relative">
                <div className="hidden md:flex relative z-10">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      s.status === "active"
                        ? "bg-fidaro-green ring-4 ring-fidaro-green/20"
                        : s.status === "next"
                        ? "bg-fidaro-green-bright"
                        : "bg-fidaro-silver"
                    }`}
                    style={{ marginTop: "1.125rem", marginLeft: "0" }}
                  />
                </div>
                <div className="mt-4 md:mt-6">
                  <div className="font-mono text-xs text-fidaro-green tracking-widest">
                    {s.tag}
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-fidaro-ink tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm text-fidaro-text-muted leading-relaxed">{s.desc}</p>
                  {s.status === "active" && (
                    <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-fidaro-green font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-fidaro-green pulse-soft" />
                      {lang === "nl" ? "Live" : "Live"}
                    </div>
                  )}
                  {s.status === "next" && (
                    <div className="mt-4 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-fidaro-green-bright font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      {lang === "nl" ? "In voorbereiding" : "In preparation"}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
