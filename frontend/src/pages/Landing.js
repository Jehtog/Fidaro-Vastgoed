import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/sections/Hero";
import ProblemSection from "../components/sections/ProblemSection";
import GapSection from "../components/sections/GapSection";
import QuickScanSection from "../components/sections/QuickScanSection";
import ProductSection from "../components/sections/ProductSection";
import StatsSection from "../components/sections/StatsSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import AdvantageSection from "../components/sections/AdvantageSection";
import PricingSection from "../components/sections/PricingSection";
import ProcessSection from "../components/sections/ProcessSection";
import CalculatorTeaser from "../components/sections/CalculatorTeaser";
import FaqSection from "../components/sections/FaqSection";
import ContactSection from "../components/sections/ContactSection";

export default function Landing() {
  return (
    <div data-testid="landing-page" className="bg-white">
      <Header />
      <main>
        <Hero />
        <ProblemSection />
        <GapSection />
        <QuickScanSection />
        <ProductSection />
        <StatsSection />
        <TestimonialsSection />
        <AdvantageSection />
        <PricingSection />
        <ProcessSection />
        <CalculatorTeaser />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
