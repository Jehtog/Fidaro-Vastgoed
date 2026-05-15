import { useLang } from "../../contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function FaqSection() {
  const { t } = useLang();
  return (
    <section id="faq" data-testid="faq-section" className="py-24 md:py-32 bg-fidaro-green-light/40">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        <div className="inline-block text-[11px] uppercase tracking-[0.22em] text-fidaro-green font-semibold px-3 py-1 rounded-full bg-white">
          {t.faq.label}
        </div>
        <h2 className="mt-6 font-display text-4xl md:text-6xl text-fidaro-ink leading-[1.02]">
          {t.faq.title}
        </h2>

        <Accordion type="single" collapsible className="mt-12 space-y-3">
          {t.faq.items.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              data-testid={`faq-item-${i}`}
              className="bg-white border border-fidaro-green-light rounded-2xl px-5 [&>h3]:my-0"
            >
              <AccordionTrigger className="text-left text-lg font-semibold text-fidaro-ink hover:text-fidaro-green hover:no-underline py-5">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-fidaro-text-muted text-sm leading-relaxed pb-5">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
