import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/sections/Hero";
import ProblemSection from "../components/sections/ProblemSection";
import GapSection from "../components/sections/GapSection";
import SolutionSection from "../components/sections/SolutionSection";
import ProductSection from "../components/sections/ProductSection";
import QuickScanSection from "../components/sections/QuickScanSection";
import StatsSection from "../components/sections/StatsSection";
import AdvantageSection from "../components/sections/AdvantageSection";
import PricingSection from "../components/sections/PricingSection";
import ProcessSection from "../components/sections/ProcessSection";
import RoadmapSection from "../components/sections/RoadmapSection";
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
        <SolutionSection />
        <ProductSection />
        <QuickScanSection />
        <StatsSection />
        <AdvantageSection />
        <PricingSection />
        <ProcessSection />
        <RoadmapSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
