import { useLang } from "../../contexts/LanguageContext";
import { Quote } from "lucide-react";

// First letter of each name → coloured circle avatar (no external images).
const initialFor = (name) => (name?.trim()?.[0] || "•").toUpperCase();

export default function TestimonialsSection() {
  const { t } = useLang();
  const T = t.testimonials;
  return (
    <section data-testid="testimonials-section" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-3xl">
          <div className="inline-block text-[11px] uppercase tracking-[0.22em] text-fidaro-green font-semibold px-3 py-1 rounded-full bg-fidaro-green-light">
            {T.label}
          </div>
          <h2 className="mt-6 font-display text-4xl md:text-5xl text-fidaro-ink leading-[1.05]">
            {T.title}
          </h2>
          <p className="mt-5 text-lg text-fidaro-text-muted leading-relaxed max-w-2xl">
            {T.body}
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {T.items.map((it, i) => (
            <div
              key={i}
              data-testid={`testimonial-${i}`}
              className={`relative rounded-3xl p-7 md:p-8 transition-all overflow-hidden ${
                i === 1
                  ? "bg-fidaro-green-dark text-white md:scale-[1.02] shadow-[0_24px_55px_-22px_rgba(63,92,73,0.4)]"
                  : "bg-fidaro-green-light/40 border border-fidaro-green-light text-fidaro-ink"
              }`}
            >
              <Quote
                className={`w-7 h-7 ${
                  i === 1 ? "text-fidaro-green-bright" : "text-fidaro-green/40"
                }`}
                strokeWidth={1.5}
              />
              <p
                className={`mt-5 text-base leading-relaxed ${
                  i === 1 ? "text-white/90" : "text-fidaro-ink"
                }`}
              >
                {`“${it.quote}”`}
              </p>
              <div className="mt-8 flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-display text-lg font-bold flex-shrink-0 ${
                    i === 1
                      ? "bg-fidaro-green-bright/20 text-fidaro-green-bright"
                      : "bg-fidaro-green text-white"
                  }`}
                >
                  {initialFor(it.name)}
                </div>
                <div>
                  <div
                    className={`text-sm font-semibold tracking-tight ${
                      i === 1 ? "text-white" : "text-fidaro-ink"
                    }`}
                  >
                    {it.name}
                  </div>
                  <div
                    className={`text-xs ${
                      i === 1 ? "text-white/55" : "text-fidaro-text-muted"
                    }`}
                  >
                    {it.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
