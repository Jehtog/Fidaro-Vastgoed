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
    <section id="faq" data-testid="faq-section" className="py-24 md:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        <div className="text-xs uppercase tracking-[0.2em] text-fidaro-green font-semibold">
          {t.faq.label}
        </div>
        <h2 className="mt-4 font-serif text-4xl md:text-5xl text-fidaro-text-dark leading-tight">
          {t.faq.title}
        </h2>

        <Accordion type="single" collapsible className="mt-12 space-y-2">
          {t.faq.items.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              data-testid={`faq-item-${i}`}
              className="border-b border-fidaro-green-light"
            >
              <AccordionTrigger className="text-left font-serif text-xl md:text-2xl text-fidaro-text-dark hover:text-fidaro-green hover:no-underline py-6">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-fidaro-text-muted text-base leading-relaxed pb-6">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
