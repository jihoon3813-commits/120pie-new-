"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { optimizeCloudinaryUrl } from "../utils/cloudinary";

const SLIDES = [
  {
    src: optimizeCloudinaryUrl(
      "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1794204309/%EC%84%B8_%EA%B0%80%EC%A7%80_%ED%95%84%EB%A7%81%EC%9D%98_120%EA%B2%B9_%EB%9F%AC%EC%8A%A4%ED%8A%B8_%ED%8C%8C%EC%9D%B4-4_kdrap5.png"
    ),
    alt: "세 가지 필링의 120겹 러스트 파이 - 포장 및 세트",
  },
  {
    src: optimizeCloudinaryUrl(
      "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1794204310/120_PIE_%EC%96%B8%EB%B0%95%EC%8B%B1%EA%B3%BC_%EB%91%90_%EA%B0%80%EC%A7%80_%EC%9B%90%ED%98%95_%ED%8C%8C%EC%9D%B4-2_zli4az.png"
    ),
    alt: "120 PIE 언박싱과 두 가지 원형 파이",
  },
  {
    src: optimizeCloudinaryUrl(
      "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1794204307/%ED%96%87%EC%82%B4_%EA%B0%80%EB%93%9D%ED%95%9C_%EC%98%A4%ED%94%BC%EC%8A%A4_%ED%8C%8C%EC%9D%B4_%EB%9F%B0%EC%B9%98-3_wahxku.png"
    ),
    alt: "햇살 가득한 오피스 파이 런치",
  },
];

export default function DeliveryImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const isHorizontalDragRef = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // 1초 자동 롤링 (사용자 인터랙션 중이 아닐 때)
  useEffect(() => {
    if (isInteracting || isDragging) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 1000);
    return () => clearInterval(interval);
  }, [isInteracting, isDragging, nextSlide]);

  // Touch handlers (모바일 손가락 스와이프)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsInteracting(true);
    const touch = e.touches[0];
    dragStartXRef.current = touch.clientX;
    dragStartYRef.current = touch.clientY;
    isHorizontalDragRef.current = false;
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const diffX = touch.clientX - dragStartXRef.current;
    const diffY = touch.clientY - dragStartYRef.current;

    if (!isHorizontalDragRef.current) {
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 8) {
        isHorizontalDragRef.current = true;
        setIsDragging(true);
      }
    }

    if (isHorizontalDragRef.current) {
      let offset = diffX;
      if (
        (currentIndex === 0 && diffX > 0) ||
        (currentIndex === SLIDES.length - 1 && diffX < 0)
      ) {
        offset = diffX * 0.35;
      }
      setDragOffset(offset);
    }
  };

  const handleTouchEnd = () => {
    if (isHorizontalDragRef.current) {
      const threshold = 40;
      if (dragOffset < -threshold) {
        nextSlide();
      } else if (dragOffset > threshold) {
        prevSlide();
      }
    }
    setDragOffset(0);
    setIsDragging(false);
    isHorizontalDragRef.current = false;
    setTimeout(() => {
      setIsInteracting(false);
    }, 500);
  };

  // Mouse drag handlers (데스크톱 마우스 스와이프)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsInteracting(true);
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    isHorizontalDragRef.current = true;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diffX = e.clientX - dragStartXRef.current;
    let offset = diffX;
    if (
      (currentIndex === 0 && diffX > 0) ||
      (currentIndex === SLIDES.length - 1 && diffX < 0)
    ) {
      offset = diffX * 0.35;
    }
    setDragOffset(offset);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      const threshold = 40;
      if (dragOffset < -threshold) {
        nextSlide();
      } else if (dragOffset > threshold) {
        prevSlide();
      }
      setDragOffset(0);
      setIsDragging(false);
    }
    setTimeout(() => {
      setIsInteracting(false);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    } else {
      setIsInteracting(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="delivery-slider"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className="delivery-slider-track"
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
          transition: isDragging
            ? "none"
            : "transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1)",
        }}
      >
        {SLIDES.map((slide, index) => (
          <div key={index} className="delivery-slide">
            <img
              src={slide.src}
              alt={slide.alt}
              className="asset-img"
              draggable={false}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
        ))}
      </div>

      {/* Prev / Next buttons */}
      <button
        type="button"
        className="delivery-slider-arrow prev"
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        aria-label="이전 이미지"
      >
        &#10094;
      </button>
      <button
        type="button"
        className="delivery-slider-arrow next"
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        aria-label="다음 이미지"
      >
        &#10095;
      </button>

      {/* Indicator dots */}
      <div className="delivery-slider-dots">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`delivery-slider-dot ${idx === currentIndex ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            aria-label={`${idx + 1}번째 이미지 보기`}
          />
        ))}
      </div>
    </div>
  );
}
