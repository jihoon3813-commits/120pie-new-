"use client";

import { useState } from "react";
import Header from "./Header";
import Hero from "./Hero";
import YouTubeVideoSection from "./YouTubeVideoSection";
import { optimizeCloudinaryUrl } from "@/app/utils/cloudinary";
import PieBrandConcept from "./PieBrandConcept";
import GrowthSection from "./GrowthSection";
import DailySales from "./DailySales";
import SetMenuStrategy from "./SetMenuStrategy";
import CrispyIdentity from "./CrispyIdentity";
import OperationSystem from "./OperationSystem";
import StoreConcept from "./StoreConcept";
import BrandCompetitiveness from "./BrandCompetitiveness";
import MenuPosterBanner from "./MenuPosterBanner";
import MenuGallery from "./MenuGallery";
import CustomerReviews from "./CustomerReviews";
import FranchiseCost from "./FranchiseCost";
import PaymentPromo from "./PaymentPromo";
import InteriorConcept from "./InteriorConcept";
import SuccessSupport from "./SuccessSupport";
import FranchiseProcess from "./FranchiseProcess";
import ContactForm from "./ContactForm";
import Footer from "./Footer";
import FloatingAndInquiry from "@/app/components/FloatingAndInquiry";
import QuickInquiryBar from "./QuickInquiryBar";
import RightFloatingQuickBar from "@/components/RightFloatingQuickBar";

import CursorFollower from "@/components/CursorFollower";

export default function LandingV6Client() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 font-sans antialiased selection:bg-amber-500 selection:text-neutral-950 transition-colors duration-300">
      {/* Dynamic Cursor Follower */}
      <CursorFollower />

      {/* Navigation Header */}
      <Header onContactClick={openContactModal} />

      {/* Main Contents */}
      <main>
        {/* Hero Banner Section */}
        <Hero />



        {/* YouTube Video Section */}
        <YouTubeVideoSection />



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

        {/* Season & New Menu Poster Sliding Banner */}
        <MenuPosterBanner />

        {/* Menu Showcase Gallery */}
        <MenuGallery />

        {/* Customer Reviews Section */}
        <CustomerReviews />

        {/* Franchise Cost Guide Section */}
        <FranchiseCost bottomWaveColor="text-[#F5F7FA] dark:text-[#111625]" />

        {/* 결제 지원 프로모션 안내 */}
        <PaymentPromo bottomWaveColor="text-white dark:text-neutral-950" />

        {/* 매장 인테리어 안내 섹션 */}
        <InteriorConcept />

        {/* Exclusive Lock-In Urgency & Success Support Section */}
        <SuccessSupport onContactClick={openContactModal} />

        {/* Franchise Guide Steps */}
        <FranchiseProcess />

        {/* Franchise Inquiry Form (페이지 하단 고정 폼) */}
        <ContactForm />
      </main>

      {/* Footer Details */}
      <Footer />

      {/* Floating Buttons & Inquiry Modal */}
      <FloatingAndInquiry />

      {/* PC 전용 하단 고정 빠른상담바 */}
      <QuickInquiryBar />

      {/* 팝업 모달 창업 문의 폼 */}
      <ContactForm isModal isOpen={isContactModalOpen} onClose={closeContactModal} />

      {/* Right Floating Quick Docking Bar (Matching Brand Page) */}
      <RightFloatingQuickBar onOpenConsultation={openContactModal} />
    </div>
  );
}
