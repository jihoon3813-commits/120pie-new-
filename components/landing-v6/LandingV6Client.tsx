"use client";

import { useState } from "react";
import Header from "./Header";
import Hero from "./Hero";
import RollingBanner from "./RollingBanner";
import PieBrandConcept from "./PieBrandConcept";
import GrowthSection from "./GrowthSection";
import DailySales from "./DailySales";
import SetMenuStrategy from "./SetMenuStrategy";
import CrispyIdentity from "./CrispyIdentity";
import OperationSystem from "./OperationSystem";
import StoreConcept from "./StoreConcept";
import BrandCompetitiveness from "./BrandCompetitiveness";
import MenuGallery from "./MenuGallery";
import CustomerReviews from "./CustomerReviews";
import FranchiseCost from "./FranchiseCost";
import SuccessSupport from "./SuccessSupport";
import FranchiseProcess from "./FranchiseProcess";
import ContactForm from "./ContactForm";
import Footer from "./Footer";

export default function LandingV6Client() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 font-sans antialiased selection:bg-amber-500 selection:text-neutral-950 transition-colors duration-300">
      {/* Navigation Header */}
      <Header onContactClick={openContactModal} />

      {/* Main Contents */}
      <main>
        {/* Hero Banner Section */}
        <Hero />

        {/* Rolling Banner with Deep Green Background */}
        <RollingBanner />

        {/* Brand Core Philosophy Section */}
        <PieBrandConcept />

        {/* Brand Growth and Store Milestone Section */}
        <GrowthSection />

        {/* Daily Sales Receipts Section */}
        <DailySales />

        {/* Set Menu Coffee Strategy Section */}
        <SetMenuStrategy />

        {/* Crispy Texture Identity Section */}
        <CrispyIdentity />

        {/* Brand Operation System Support Section */}
        <OperationSystem />

        {/* Brand Store Concept Section */}
        <StoreConcept />

        {/* Brand Competitiveness Section */}
        <BrandCompetitiveness />

        {/* Menu Showcase Gallery */}
        <MenuGallery />

        {/* Customer Reviews Section */}
        <CustomerReviews />

        {/* Franchise Cost Guide Section */}
        <FranchiseCost />

        {/* Exclusive Lock-In Urgency & Success Support Section */}
        <SuccessSupport onContactClick={openContactModal} />

        {/* Franchise Guide Steps */}
        <FranchiseProcess />

        {/* Franchise Inquiry Form (페이지 하단 고정 폼) */}
        <ContactForm />
      </main>

      {/* Footer Details */}
      <Footer />

      {/* 팝업 모달 창업 문의 폼 */}
      <ContactForm isModal isOpen={isContactModalOpen} onClose={closeContactModal} />
    </div>
  );
}
