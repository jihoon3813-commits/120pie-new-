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
import SuccessSupport from "./SuccessSupport";
import FranchiseProcess from "./FranchiseProcess";
import ContactForm from "./ContactForm";
import Footer from "./Footer";
import FloatingAndInquiry from "@/app/components/FloatingAndInquiry";
import QuickInquiryBar from "./QuickInquiryBar";

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



        {/* YouTube Video Section */}
        <YouTubeVideoSection />

        {/* New Promotional Image Banner below YouTube Video Section */}
        <section className="relative w-full h-auto overflow-hidden bg-white">
          {/* 💻 Desktop Banner Image */}
          <img
            src={optimizeCloudinaryUrl("https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783846475/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_12%EC%9D%BC_%EC%98%A4%ED%9B%84_05_54_25_esvngp.png")}
            alt="120겹 파이 프로모션 배너 (데스크톱)"
            className="hidden sm:block w-full h-auto object-cover"
          />
          {/* 📱 Mobile Banner Image */}
          <img
            src={optimizeCloudinaryUrl("https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783847298/ChatGPT_Image_2026%EB%85%84_7%EC%9B%94_12%EC%9D%BC_%EC%98%A4%ED%9B%84_06_08_04_kllhan.png")}
            alt="120겹 파이 프로모션 배너 (모바일)"
            className="block sm:hidden w-full h-auto object-cover"
          />
          {/* Bottom Wavy transition boundary to PieBrandConcept (Matching white background) */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[2px]">
            <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="relative block w-full h-[24px] sm:h-[40px] lg:h-[55px] text-white dark:text-neutral-950">
              <path
                d="M 0 50 Q 25 10, 50 50 Q 75 90, 100 50 Q 125 10, 150 50 Q 175 90, 200 50 Q 225 10, 250 50 Q 275 90, 300 50 Q 325 10, 350 50 Q 375 90, 400 50 Q 425 10, 450 50 Q 475 90, 500 50 Q 525 10, 550 50 Q 575 90, 600 50 Q 625 10, 650 50 Q 675 90, 700 50 Q 725 10, 750 50 Q 775 90, 800 50 Q 825 10, 850 50 Q 875 90, 900 50 Q 925 10, 950 50 Q 975 90, 1000 50 Q 1025 10, 1050 50 Q 1075 90, 1100 50 Q 1125 10, 1150 50 Q 1175 90, 1200 50 L 1200 100 L 0 100 Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </section>

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

      {/* Floating Buttons & Inquiry Modal */}
      <FloatingAndInquiry />

      {/* PC 전용 하단 고정 빠른상담바 */}
      <QuickInquiryBar />

      {/* 팝업 모달 창업 문의 폼 */}
      <ContactForm isModal isOpen={isContactModalOpen} onClose={closeContactModal} />
    </div>
  );
}
