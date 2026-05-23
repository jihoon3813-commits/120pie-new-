import BenefitSection from "@/components/BenefitSection";
import CaseSection from "@/components/CaseSection";
import ComparisonSection from "@/components/ComparisonSection";
import ConsultationForm from "@/components/ConsultationForm";
import ExpoSection from "@/components/ExpoSection";
import FAQSection from "@/components/FAQSection";
import FloatingCTA from "@/components/FloatingCTA";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import OperationSection from "@/components/OperationSection";
import ProblemSection from "@/components/ProblemSection";
import ProcessSection from "@/components/ProcessSection";
import ProfitCalculator from "@/components/ProfitCalculator";
import ProofSection from "@/components/ProofSection";
import ShopInShopSection from "@/components/ShopInShopSection";
import SupportSection from "@/components/SupportSection";
import WasteReductionSection from "@/components/WasteReductionSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <BenefitSection />
        <ProfitCalculator />
        <ShopInShopSection />
        <MenuSection />
        <OperationSection />
        <WasteReductionSection />
        <ComparisonSection />
        <ProofSection />
        <CaseSection />
        <ExpoSection />
        <ProcessSection />
        <SupportSection />
        <FAQSection />
        <ConsultationForm />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
