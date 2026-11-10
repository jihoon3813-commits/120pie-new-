"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import "./styles.css";
import { optimizeCloudinaryUrl } from "../utils/cloudinary";
import DeliveryImageSlider from "./DeliveryImageSlider";
import Footer from "@/components/landing-v6/Footer";

type SubmitStatus = "" | "pending" | "success" | "duplicate" | "error";

export default function AdLandingClient() {
  const heroRef = useRef<HTMLElement | null>(null);
  const consultRef = useRef<HTMLElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  const ownerRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const regionRef = useRef<HTMLInputElement | null>(null);
  const typeRef = useRef<HTMLSelectElement | null>(null);
  const consentRef = useRef<HTMLInputElement | null>(null);

  type CostTabId = "shop120" | "shopegg120" | "shopegg" | "hybrid" | "franchise";
  const [costTab, setCostTab] = useState<CostTabId>("shop120");

  const [fixedHidden, setFixedHidden] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [storeType, setStoreType] = useState("");
  const [consent, setConsent] = useState(false);

  const [errors, setErrors] = useState<{
    owner: string;
    phone: string;
    region: string;
    type: string;
    consent: string;
  }>({
    owner: "",
    phone: "",
    region: "",
    type: "",
    consent: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("");
  const lastSubmittedKeyRef = useRef<string>("");

  // Consultation Modal Popup State
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [modalName, setModalName] = useState("");
  const [modalPhone, setModalPhone] = useState("");
  const [modalRegion, setModalRegion] = useState("");
  const [modalStoreType, setModalStoreType] = useState("기존 카페 운영 중");
  const [modalConsent, setModalConsent] = useState(false);
  const [modalErrors, setModalErrors] = useState<{
    owner: string;
    phone: string;
    region: string;
    type: string;
    consent: string;
  }>({
    owner: "",
    phone: "",
    region: "",
    type: "",
    consent: "",
  });
  const [modalIsSubmitting, setModalIsSubmitting] = useState(false);
  const [modalSubmitStatus, setModalSubmitStatus] = useState<SubmitStatus>("");
  const [modalStatusMessage, setModalStatusMessage] = useState("");

  const openConsultModal = () => {
    setIsConsultModalOpen(true);
    setModalSubmitStatus("");
    setModalStatusMessage("");
    setModalErrors({
      owner: "",
      phone: "",
      region: "",
      type: "",
      consent: "",
    });
  };

  const closeConsultModal = () => {
    setIsConsultModalOpen(false);
  };

  useEffect(() => {
    if (!isConsultModalOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeConsultModal();
    };
    document.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isConsultModalOpen]);

  // Back button trap on Ad page: Show consultation modal instead of exit popup
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      window.history.pushState({ isAdPage: true }, "", window.location.href);
    } catch (_) {}

    const handleAdPopState = () => {
      setIsConsultModalOpen((prev) => {
        if (!prev) {
          try {
            window.history.pushState({ isAdPage: true }, "", window.location.href);
          } catch (_) {}
          return true;
        }
        return false;
      });
    };

    window.addEventListener("popstate", handleAdPopState);
    return () => {
      window.removeEventListener("popstate", handleAdPopState);
    };
  }, []);

  const handleModalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (modalIsSubmitting) return;

    const nextErrors = {
      owner: modalName.trim() ? "" : "성함을 입력해 주세요.",
      phone: "",
      region: modalRegion.trim() ? "" : "희망 도입 지역을 입력해 주세요.",
      type: modalStoreType.trim() ? "" : "현재 매장 상황을 선택해 주세요.",
      consent: modalConsent ? "" : "개인정보 수집·이용 안내를 확인하고 동의해 주세요.",
    };

    const cleanPhone = modalPhone.replace(/[\s-]/g, "");
    if (!cleanPhone) {
      nextErrors.phone = "연락처를 입력해 주세요.";
    } else if (!/^01[016789]\d{7,8}$/.test(cleanPhone)) {
      nextErrors.phone = "휴대전화 번호를 다시 확인해 주세요.";
    }

    setModalErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setModalIsSubmitting(true);
    setModalSubmitStatus("pending");

    let partnerId: string | undefined;
    let partnerName: string | undefined;
    let partnerCompany: string | undefined;
    try {
      partnerId = localStorage.getItem("120_referral_partner_id") || undefined;
      partnerName = localStorage.getItem("120_referral_partner_name") || undefined;
      partnerCompany = localStorage.getItem("120_referral_partner_company") || undefined;
    } catch (_) {}

    try {
      const response = await fetch("/api/ad-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: modalName.trim(),
          phone: modalPhone.trim(),
          region: modalRegion.trim(),
          type: modalStoreType.trim(),
          consent: modalConsent,
          partnerId,
          partnerName,
          partnerCompany,
          path: typeof window !== "undefined" ? window.location.pathname : "/ad",
          referrer: typeof document !== "undefined" ? document.referrer || "direct" : "direct",
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        setModalSubmitStatus("success");
        setModalStatusMessage(
          data.message ||
            "우리 동네 도입 상담이 정상 접수되었습니다. 담당자가 상권 현황을 확인하여 빠르게 연락드리겠습니다."
        );
        fireConversionTracking();
      } else if (response.status === 409 || data?.code === "DUPLICATE_SUBMISSION") {
        setModalSubmitStatus("duplicate");
        setModalStatusMessage(
          data?.message ||
            "이미 동일한 내용으로 상담 신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다."
        );
      } else {
        setModalSubmitStatus("error");
        setModalStatusMessage(
          data?.message || "접수 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
        );
      }
    } catch (_) {
      setModalSubmitStatus("error");
      setModalStatusMessage("접수 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setModalIsSubmitting(false);
    }
  };

  // Capture referral partner code from URL query params if present
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const refPartner = (
        params.get("partner") ||
        params.get("partnerId") ||
        params.get("ref") ||
        ""
      ).trim();
      if (refPartner) {
        localStorage.setItem("120_referral_partner_id", refPartner);
      }
    } catch (_) {}
  }, []);

  const updateFixed = useCallback(() => {
    if (typeof window === "undefined") return;
    const heroEl = heroRef.current;
    const consultEl = consultRef.current;
    if (!heroEl || !consultEl) return;

    const formFocus = consultEl.contains(document.activeElement);
    const shouldHide =
      heroEl.getBoundingClientRect().bottom > 100 ||
      consultEl.getBoundingClientRect().top < window.innerHeight ||
      formFocus;

    setFixedHidden(shouldHide);
  }, []);

  useEffect(() => {
    updateFixed();
    const onFocusOut = () => requestAnimationFrame(updateFixed);
    window.addEventListener("scroll", updateFixed, { passive: true });
    window.addEventListener("resize", updateFixed);
    document.addEventListener("focusin", updateFixed);
    document.addEventListener("focusout", onFocusOut);

    return () => {
      window.removeEventListener("scroll", updateFixed);
      window.removeEventListener("resize", updateFixed);
      document.removeEventListener("focusin", updateFixed);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, [updateFixed]);

  // Scroll reveal animation observer
  useEffect(() => {
    if (typeof window === "undefined") return;

    const elements = document.querySelectorAll<HTMLElement>(
      "#ad-landing-root .scroll-reveal"
    );

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  const formatPhoneInput = (value: string) => {
    const digits = value.replace(/[^\d]/g, "").slice(0, 11);
    if (digits.length < 4) return digits;
    if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (digits.length === 10) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };

  const scrollMessageIntoView = () => {
    requestAnimationFrame(() => {
      if (!messageRef.current) return;
      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      messageRef.current.scrollIntoView({
        block: "nearest",
        behavior: reduceMotion ? "instant" : "smooth",
      });
    });
  };

  const fireConversionTracking = () => {
    if (typeof window === "undefined") return;
    try {
      const w = window as any;
      if (w.wcs) {
        if (!w.wcs_add) w.wcs_add = {};
        w.wcs_add["wa"] =
          process.env.NEXT_PUBLIC_NAVER_AD_ACCOUNT_ID || "s_15663594120p";
        const _nasa: Record<string, any> = {};
        _nasa["cnv"] = w.wcs.cnv("4", "10");
        if (typeof w.wcs_do === "function") w.wcs_do(_nasa);
      }
    } catch (_) {}
    try {
      const w = window as any;
      if (w.karrotPixel && typeof w.karrotPixel.track === "function") {
        w.karrotPixel.track("SubmitApplication");
      }
    } catch (_) {}
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const nextErrors = {
      owner: name.trim() ? "" : "성함을 입력해 주세요.",
      phone: "",
      region: region.trim() ? "" : "희망 도입 지역을 입력해 주세요.",
      type: storeType.trim() ? "" : "현재 매장 상황을 선택해 주세요.",
      consent: consent ? "" : "개인정보 수집·이용 안내를 확인하고 동의해 주세요.",
    };

    const cleanPhone = phone.replace(/[\s-]/g, "");
    if (!cleanPhone) {
      nextErrors.phone = "연락처를 입력해 주세요.";
    } else if (!/^01[016789]\d{7,8}$/.test(cleanPhone)) {
      nextErrors.phone = "휴대전화 번호를 다시 확인해 주세요.";
    }

    setErrors(nextErrors);

    let firstInvalid: HTMLElement | null = null;
    if (nextErrors.owner) firstInvalid = ownerRef.current;
    else if (nextErrors.phone) firstInvalid = phoneRef.current;
    else if (nextErrors.region) firstInvalid = regionRef.current;
    else if (nextErrors.type) firstInvalid = typeRef.current;
    else if (nextErrors.consent) firstInvalid = consentRef.current;

    if (firstInvalid) {
      setStatusMessage("");
      setSubmitStatus("");
      firstInvalid.focus();
      return;
    }

    const submissionKey = `${cleanPhone}:${region.trim()}:${storeType.trim()}`;
    if (lastSubmittedKeyRef.current && lastSubmittedKeyRef.current === submissionKey) {
      setStatusMessage(
        "이미 동일한 내용으로 상담 신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다."
      );
      setSubmitStatus("duplicate");
      scrollMessageIntoView();
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("상담 신청 결과를 확인 중입니다. 잠시만 기다려 주세요...");
    setSubmitStatus("pending");
    scrollMessageIntoView();

    let partnerId: string | undefined;
    let partnerName: string | undefined;
    let partnerCompany: string | undefined;
    try {
      partnerId = localStorage.getItem("120_referral_partner_id") || undefined;
      partnerName = localStorage.getItem("120_referral_partner_name") || undefined;
      partnerCompany = localStorage.getItem("120_referral_partner_company") || undefined;
    } catch (_) {}

    try {
      const response = await fetch("/api/ad-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          region: region.trim(),
          type: storeType.trim(),
          consent,
          partnerId,
          partnerName,
          partnerCompany,
          path: typeof window !== "undefined" ? window.location.pathname : "/ad",
          referrer: typeof document !== "undefined" ? document.referrer || "direct" : "direct",
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        lastSubmittedKeyRef.current = submissionKey;
        setStatusMessage(
          data.message ||
            "상담 신청이 정상적으로 접수되었습니다. 담당자가 확인 후 빠르게 연락드리겠습니다."
        );
        setSubmitStatus("success");
        fireConversionTracking();
      } else if (response.status === 409 || data?.code === "DUPLICATE_SUBMISSION") {
        lastSubmittedKeyRef.current = submissionKey;
        setStatusMessage(
          data?.message ||
            "이미 동일한 내용으로 상담 신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다."
        );
        setSubmitStatus("duplicate");
      } else if (response.status === 400 && data?.fieldErrors) {
        setStatusMessage("");
        setSubmitStatus("");
        setErrors((prev) => ({
          ...prev,
          owner: data.fieldErrors.owner || "",
          phone: data.fieldErrors.phone || "",
          region: data.fieldErrors.region || "",
          type: data.fieldErrors.type || "",
          consent: data.fieldErrors.consent || "",
        }));
        if (data.fieldErrors.owner) ownerRef.current?.focus();
        else if (data.fieldErrors.phone) phoneRef.current?.focus();
        else if (data.fieldErrors.region) regionRef.current?.focus();
        else if (data.fieldErrors.type) typeRef.current?.focus();
        else if (data.fieldErrors.consent) consentRef.current?.focus();
      } else {
        setStatusMessage(
          data?.message ||
            "일시적인 오류로 상담 신청이 저장되지 않았습니다. 잠시 후 다시 시도하거나 1566-3594로 문의해 주세요."
        );
        setSubmitStatus("error");
      }
    } catch (_) {
      setStatusMessage(
        "네트워크 연결을 확인할 수 없어 상담 신청이 완료되지 않았습니다. 잠시 후 다시 시도하거나 1566-3594로 문의해 주세요."
      );
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
      scrollMessageIntoView();
    }
  };

  return (
    <div id="ad-landing-root">
      <a className="skip" href="#main" data-editorial="true">
        본문 바로가기
      </a>
      <header className="bar" id="top">
        <div className="wrap">
          <a className="brand" href="#top" aria-label="120PIE 처음으로">
            <img
              src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784536582/Group_2_ma3j8j.png"
              alt="120PIE Logo"
              className="w-auto object-contain"
            />
          </a>
          <div className="header-actions">
            <button
              type="button"
              className="header-cta"
              onClick={openConsultModal}
              style={{ cursor: "pointer", border: 0 }}
            >
              우리 지역 도입 상담 ↗
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        {/* 1. HERO */}
        <section className="s-hero hero" id="hero" ref={heroRef}>
          <div className="wrap hero-top">
            <span className="kicker">
              카페 사장님, 다음 디저트는 누가 먼저 가져갈까요?
            </span>
            <h1>
              우리 동네 <br />
              디저트 손님, <br />
              <mark>내가 먼저 잡는다.</mark>
            </h1>
            <p>
              옆집 카페의 신메뉴로 만나기 전에. <br />
              <b>120겹 파이를 우리 매장의 무기로 만드세요.</b>
            </p>
            <button
              type="button"
              className="cta"
              onClick={openConsultModal}
              style={{ cursor: "pointer", border: 0 }}
            >
              우리 동네 도입 가능 여부 확인<span>↗</span>
            </button>
            <div className="hero-visual">
              <div
                className="asset has-image"
                id="asset-01"
                data-asset="01"
              >
                <img
                  src={optimizeCloudinaryUrl(
                    "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1793681284/%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC_%ED%8E%98%ED%8D%BC%EB%A1%9C%EB%8B%88_%EC%82%AC%EA%B3%BC_%ED%8C%8C%EC%9D%B4%EC%9D%98_%ED%95%9C%EC%83%81_e8g3va.png"
                  )}
                  alt="120겹 파이 대표 비주얼 - 블루베리, 페퍼로니, 애플 파이 한상"
                  className="asset-img"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="label">
                <small>YOUR NEXT SIGNATURE</small>
                커피 옆 한 자리. <br />
                동네 디저트의 다음 주인공.
              </div>
            </div>
          </div>
        </section>

        <div className="ticker">
          맛으로 끌고 · 간편하게 만들고 · 포장으로 넓히고 · 우리 지역부터 확인
        </div>

        {/* 2. COMPETITION */}
        <section className="s-competition section white" id="competition">
          <div className="wrap scroll-reveal">
            <span className="eyebrow">01 / 사장님의 진짜 경쟁</span>
            <h2>
              손님이 디저트 사러 <br />
              옆집으로 간다면? <br />그 주문, <u>우리 매장으로.</u>
            </h2>
            <p className="lead">
              커피를 찾는 손님에게, 함께 먹을 이유까지. <br />
              음료만 팔던 메뉴판에 파이 한 가지가 더해지면 <br />
              제안할 수 있는 장면도 달라집니다.
            </p>
            <div className="comparison scroll-reveal-delay-1">
              <div className="compare">
                <small>지금의 고민</small>
                <h3>
                  “커피는 있는데, <br />
                  함께 팔 메뉴가 없다.”
                </h3>
                <p>
                  직접 베이킹을 하자니 부담. <br />
                  흔한 디저트를 들이자니 차별화가 고민.
                </p>
              </div>
              <div className="compare active">
                <small>다음 메뉴의 방향</small>
                <h3>
                  “그 파이 먹으러 <br />
                  오는 카페가 되자.”
                </h3>
                <p>
                  파이와 커피의 조합부터 포장 메뉴까지. <br />
                  우리 매장을 선택할 새로운 이유를 만드세요.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. PROOF */}
        <section className="s-proof section" id="proof">
          <div className="wrap center">
            <div className="scroll-reveal">
              <span className="eyebrow">02 / 매장 선택의 근거</span>
              <h2>
                <span className="title-line">한 매장의 아이디어를 넘어,</span>
                <span className="yellow title-line">전국으로 퍼진 파이.</span>
              </h2>
              <div className="large-stat">
                200<small>호점</small>
              </div>
              <p className="lead" style={{ marginTop: "25px" }}>
                내 매장에도 맞을까? <br />
                중요한 건 숫자 다음의 이야기입니다. <br />
                어떤 매장이, 어떻게 판매하고 운영하는지 확인하세요.
              </p>
            </div>
            <div className="proof-grid scroll-reveal scroll-reveal-delay-1">
              <div className="proof scroll-reveal-item">
                <div
                  className="asset has-image"
                  id="asset-proof-01"
                >
                  <img
                    src={optimizeCloudinaryUrl(
                      "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1794196987/%EB%B2%BD%EB%8F%8C_%EA%B3%A8%EB%AA%A9%EC%9D%98_120PIE_COFFEE_%EC%B9%B4%ED%8E%98-2_1_vtmbaf.png"
                    )}
                    alt="120PIE 감성 골목 로드샵 외관"
                    className="asset-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="proof-copy">
                  <span className="num">STORE 01</span>
                  <b>감성 골목 로드샵</b>
                  <p>
                    클래식한 벽돌과 옐로우의 조화 <br />
                    골목길 발걸음을 멈추게 하는 감성 매장.
                  </p>
                </div>
              </div>

              <div className="proof scroll-reveal-item">
                <div
                  className="asset has-image"
                  id="asset-proof-02"
                >
                  <img
                    src={optimizeCloudinaryUrl(
                      "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1794196986/%EB%85%B8%EB%9E%80_%ED%8C%8C%EC%82%AC%EB%93%9C%EC%9D%98_120PIE_%EC%BD%94%EB%84%88_%EC%B9%B4%ED%8E%98-1_1_zxttjl.png"
                    )}
                    alt="120PIE 코너 상가 랜드마크형 외관"
                    className="asset-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="proof-copy">
                  <span className="num">STORE 02</span>
                  <b>코너 상가 랜드마크형</b>
                  <p>
                    양면 통유리로 가시성을 극대화하여 <br />
                    사거리 보행자 시선을 사로잡는 코너 매장.
                  </p>
                </div>
              </div>

              <div className="proof scroll-reveal-item">
                <div
                  className="asset has-image"
                  id="asset-proof-03"
                >
                  <img
                    src={optimizeCloudinaryUrl(
                      "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1794196986/%EB%94%B0%EB%9C%BB%ED%95%9C_%EB%8F%99%EB%84%A4_120PIE_%EC%B9%B4%ED%8E%98_%EC%99%B8%EA%B4%80-3_1_pfjci1.png"
                    )}
                    alt="120PIE 주거 상권 동네 카페형 외관"
                    className="asset-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="proof-copy">
                  <span className="num">STORE 03</span>
                  <b>주거 상권 동네 카페형</b>
                  <p>
                    원목 벤치와 따뜻한 조명 연출로 <br />
                    이웃 주민이 매일 편안히 찾는 사랑방 매장.
                  </p>
                </div>
              </div>

              <div className="proof scroll-reveal-item">
                <div
                  className="asset has-image"
                  id="asset-proof-04"
                >
                  <img
                    src={optimizeCloudinaryUrl(
                      "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1794196985/OpenAI_Playground_2026-11-03_at_14.05.50_0_5_calh8y.png"
                    )}
                    alt="120PIE 교외·대로변 드라이브형 외관"
                    className="asset-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="proof-copy">
                  <span className="num">STORE 04</span>
                  <b>교외·대로변 드라이브형</b>
                  <p>
                    전용 주차 공간과 와이드 파사드로 <br />
                    차량 이동 고객 유입에 최적화된 로드사이드.
                  </p>
                </div>
              </div>

              <div className="proof scroll-reveal-item">
                <div
                  className="asset has-image"
                  id="asset-proof-05"
                >
                  <img
                    src={optimizeCloudinaryUrl(
                      "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1794196984/OpenAI_Playground_2026-11-03_at_14.05.50_0_2_jy7wni.png"
                    )}
                    alt="120PIE 도심 번화가 스트리트형 외관"
                    className="asset-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="proof-copy">
                  <span className="num">STORE 05</span>
                  <b>도심 번화가 스트리트형</b>
                  <p>
                    돌출 간판과 A형 입간판으로 시선 집중 <br />
                    유동인구 빠른 테이크아웃 수요를 잡는 매장.
                  </p>
                </div>
              </div>

              <div className="proof scroll-reveal-item">
                <div
                  className="asset has-image"
                  id="asset-proof-06"
                >
                  <img
                    src={optimizeCloudinaryUrl(
                      "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1794196984/OpenAI_Playground_2026-11-03_at_14.05.50_0_1_pdb8ct.png"
                    )}
                    alt="120PIE 대형 복합 쇼핑몰 인샵형 외관"
                    className="asset-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="proof-copy">
                  <span className="num">STORE 06</span>
                  <b>복합 쇼핑몰 인샵(In-Mall)형</b>
                  <p>
                    세련된 오픈 파사드로 내부 고객 유입 <br />
                    쇼핑과 여유로운 디저트 타임을 함께 제공.
                  </p>
                </div>
              </div>
            </div>
            <div className="review-note">
              골목 상권, 코너 상가, 주거지, 로드사이드, 번화가, 복합몰 등 다양한 상권에 최적화된 120PIE 매장 외관 연출 예시입니다.
            </div>
          </div>
        </section>

        {/* 4. MENU */}
        <section className="s-menu section yellow-section" id="menu">
          <div className="wrap">
            <div className="scroll-reveal">
              <span className="eyebrow">03 / 고객을 멈춰 세울 한 입</span>
              <h2>
                흔한 디저트로는 <br />
                못 뺏는 시선. <br />이 파이로 <u>잡으세요.</u>
              </h2>
              <p className="lead">
                바삭한 페이스트리와 풍성한 필링. <br />
                “커피만 주세요”에 멈추지 않도록, <br />
                함께 고르고 싶은 메뉴를 보여주세요.
              </p>
            </div>
            <div className="menu-grid scroll-reveal scroll-reveal-delay-1">
              <article className="scroll-reveal-item">
                <div className="menu-photo">
                  <div
                    className="asset has-image"
                    id="asset-05"
                    data-asset="05"
                  >
                    <img
                      src={optimizeCloudinaryUrl(
                        "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1793681734/%EB%94%B0%EB%9C%BB%ED%95%9C_%EC%98%A4%ED%9B%84%EC%9D%98_%EC%95%A0%ED%94%8C%ED%8C%8C%EC%9D%B4%EC%99%80_%EB%9D%BC%EB%96%BC-2_z4kwbk.png"
                      )}
                      alt="120PIE 애플파이와 라떼"
                      className="asset-img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
                <div className="copy">
                  <h3>달콤하게 끌고</h3>
                  <p>
                    애플파이 <br />
                    커피와 함께 즐기는 디저트 메뉴.
                  </p>
                </div>
              </article>
              <article className="scroll-reveal-item">
                <div className="menu-photo">
                  <div
                    className="asset has-image"
                    id="asset-06"
                    data-asset="06"
                  >
                    <img
                      src={optimizeCloudinaryUrl(
                        "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1793681735/%EC%B9%B4%ED%8E%98%EC%9D%98_%EB%B6%88%EA%B3%A0%EA%B8%B0_%ED%8C%8C%EC%9D%B4%EC%99%80_%EC%95%84%EC%9D%B4%EC%8A%A4_%EC%95%84%EB%A9%94%EB%A6%AC%EC%B9%B4%EB%85%B8_cm7g5z.png"
                      )}
                      alt="120PIE 불고기파이와 아이스 아메리카노"
                      className="asset-img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
                <div className="copy">
                  <h3>든든하게 채우고</h3>
                  <p>
                    불고기파이 <br />
                    출출한 시간에 제안할 간식 메뉴.
                  </p>
                </div>
              </article>
              <article className="scroll-reveal-item">
                <div className="menu-photo">
                  <div
                    className="asset has-image"
                    id="asset-07"
                    data-asset="07"
                  >
                    <img
                      src={optimizeCloudinaryUrl(
                        "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1793681736/%EC%B9%B4%ED%8E%98%EC%97%90%EC%84%9C_%EC%A6%90%EA%B8%B0%EB%8A%94_%ED%99%A9%EA%B8%88_%ED%8E%98%ED%8D%BC%EB%A1%9C%EB%8B%88_%ED%8C%8C%EC%9D%B4-3_xmppmi.png"
                      )}
                      alt="120PIE 카페에서 즐기는 황금 페퍼로니 파이"
                      className="asset-img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
                <div className="copy">
                  <h3>취향까지 잡고</h3>
                  <p>
                    페페로니 피자파이 <br />
                    익숙한 맛을 색다르게 즐기는 메뉴.
                  </p>
                </div>
              </article>
            </div>
            <p className="small">
              제품 이미지는 원본 브랜드 페이지 자료입니다. 공급 메뉴와 최종 판매 구성은 상담 시 확인합니다.
            </p>
          </div>
        </section>

        {/* 5. OPERATION */}
        <section className="s-operation section" id="operation">
          <div className="wrap">
            <div className="scroll-reveal">
              <span className="eyebrow">04 / 운영의 장벽을 낮추다</span>
              <h2>
                사장님이 될 건 <br />
                파티시에가 아니라, <br />
                <span className="yellow">파이를 파는 사장님.</span>
              </h2>
              <p className="lead">
                반죽부터 배우는 베이킹 대신, <br />
                본사 공급 제품과 전용 장비를 활용하는 운영 방식. <br />
                <b style={{ color: "white" }}>
                  만드는 건 간편하게. 내놓는 건 근사하게.
                </b>
              </p>
            </div>
            <div
              className="asset has-media scroll-reveal scroll-reveal-delay-1"
              id="asset-08"
              data-asset="08"
            >
              <video
                src={optimizeCloudinaryUrl(
                  "https://res.cloudinary.com/mmo2pulq/video/upload/f_auto,q_auto/v1793681885/Video_Project_15-2.mp4"
                )}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="asset-img"
                aria-label="120겹 파이 실제 조리 및 운영 과정 영상"
              />
            </div>
            <div className="step-grid scroll-reveal scroll-reveal-delay-2">
              <div className="step scroll-reveal-item">
                <span className="number">01</span>
                <h3>준비하고</h3>
                <p>
                  공급 제품과 필링을 <br />
                  매뉴얼에 맞춰 준비.
                </p>
              </div>
              <div className="step scroll-reveal-item">
                <span className="number">02</span>
                <h3>굽고</h3>
                <p>
                  전용 장비와 조리 교육으로 <br />
                  매장에서 파이를 완성.
                </p>
              </div>
              <div className="step scroll-reveal-item">
                <span className="number">03</span>
                <h3>담아내고</h3>
                <p>
                  커피 세트 또는 포장 메뉴로 <br />
                  고객에게 제안.
                </p>
              </div>
            </div>
            <p className="punch scroll-reveal">
              복잡한 기술보다, <br />
              <span className="yellow">반복할 수 있는 운영이 먼저입니다.</span>
            </p>
          </div>
        </section>

        {/* 6. REVIEWS */}
        <section className="s-reviews section white" id="reviews">
          <div className="wrap">
            <div className="scroll-reveal">
              <span className="eyebrow">05 / 고객의 선택을 증명</span>
              <h2>
                본사 말 백 마디보다, <br />
                고객이 남긴 <u>한 줄.</u>
              </h2>
              <p className="lead">
                맛은 설명할 수 있습니다. <br />
                다시 찾는 이유는 고객의 목소리로 보여줘야 합니다.
              </p>
            </div>
            <div className="reviews scroll-reveal scroll-reveal-delay-1">
              <article className="review scroll-reveal-item">
                <small>실제 고객 후기 · 맛과 조합</small>
                <h3>
                  “치즈와 애플잼 조합이 <br />
                  이렇게 좋을 줄 몰랐어요.”
                </h3>
                <p>
                  바삭한 120겹 페스츄리 속 달콤한 잼과 고소한 치즈. <br />
                  커피와 함께 곁들이기 좋은 디저트로 손꼽히는 이유입니다.
                </p>
                <div
                  className="asset has-image"
                  id="asset-09"
                  data-asset="09"
                >
                  <img
                    src={optimizeCloudinaryUrl(
                      "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1794204089/%EC%95%A0%ED%94%8C%EC%9E%BC%EA%B3%BC_%EB%AA%A8%EC%A7%9C%EB%A0%90%EB%9D%BC_120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%ED%9B%84%EA%B8%B0_1_ks7zkd.png"
                    )}
                    alt="120겹파이 실제 고객 후기 - 애플잼과 모짜렐라 치즈 조합"
                    className="asset-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </article>
              <article className="review scroll-reveal-item">
                <small>실제 고객 후기 · 포장 경험</small>
                <h3>
                  “포장도 깔끔하게 해주셔서 <br />
                  선물하기에도 딱 좋아요.”
                </h3>
                <p>
                  매장 취식뿐 아니라 테이크아웃과 선물용 수요까지. <br />
                  단정하고 위생적인 전용 패키지로 완성도를 높였습니다.
                </p>
                <div
                  className="asset has-image"
                  id="asset-10"
                  data-asset="10"
                >
                  <img
                    src={optimizeCloudinaryUrl(
                      "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1794204088/%EA%B9%94%EB%81%94%ED%95%9C_%ED%8F%AC%EC%9E%A5_120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EA%B3%A0%EA%B0%9D_%ED%9B%84%EA%B8%B0_1_kg9qgd.png"
                    )}
                    alt="120겹파이 실제 고객 후기 - 깔끔한 포장과 테이크아웃 패키지"
                    className="asset-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </article>
            </div>
            <p className="small">
              실제 매장을 방문하고 포장 구매한 고객님들의 솔직한 이용 후기입니다.
            </p>
          </div>
        </section>

        {/* 7. DELIVERY */}
        <section className="s-delivery section" id="delivery">
          <div className="wrap">
            <div className="scroll-reveal">
              <span className="eyebrow">06 / 매장 밖의 주문까지</span>
              <h2>
                홀 손님만 기다릴 건가요? <br />
                <span className="yellow">
                  배달앱에도 <br />
                  우리 파이를 띄우세요.
                </span>
              </h2>
            </div>
            <div className="split scroll-reveal scroll-reveal-delay-1">
              <div className="photo">
                <div
                  className="asset has-image"
                  id="asset-11"
                  data-asset="11"
                  aria-label="포장·커피 세트 이미지 슬라이더"
                >
                  <DeliveryImageSlider />
                </div>
                <div
                  className="asset phone-asset has-image"
                  id="asset-12"
                  data-asset="12"
                  role="img"
                  aria-label="실제 배달앱 메뉴 화면"
                >
                  <img
                    src={optimizeCloudinaryUrl(
                      "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1794204305/120_PIE_%ED%8C%8C%EC%9D%B4%EC%99%80_%EC%BB%A4%ED%94%BC_%EB%A9%94%EB%89%B4-5_tpwtgy.png"
                    )}
                    alt="실제 배달앱 메뉴 화면 - 120 PIE 파이와 커피 메뉴"
                    className="asset-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              <div>
                <p className="lead">
                  한 가지 제품으로, <br />더 다양한 매출 기회를.
                </p>
                <ul className="checks">
                  <li>커피와 함께 제안하는 세트 구성</li>
                  <li>집과 사무실로 가져가는 포장 메뉴</li>
                  <li>배달 메뉴판에 추가할 디저트 선택지</li>
                </ul>
                <button
                  type="button"
                  className="cta"
                  onClick={openConsultModal}
                  style={{ cursor: "pointer", border: 0 }}
                >
                  우리 매장 판매 구성 상담<span>↗</span>
                </button>
              </div>
            </div>
            <div className="review-note">
              최종 콘텐츠: 실제 배달앱 메뉴 화면·주문 자료·배달 후기 삽입. 배달 매출·순위·재주문율은 근거가 확보된 매장과 기간에 한해 표시합니다.
            </div>
          </div>
        </section>

        {/* 8. TERRITORY */}
        <section className="s-territory section yellow-section" id="territory">
          <div className="wrap">
            <div className="scroll-reveal">
              <span className="eyebrow">07 / 지금 문의할 이유</span>
              <h2>
                같은 동네, 같은 파이. <br />
                경쟁점 메뉴판에서 <br />
                <u>먼저 보시겠습니까?</u>
              </h2>
              <p className="lead">
                메뉴를 고민했다면, <br />
                이제 우리 지역의 도입 조건을 확인할 차례입니다.
              </p>
            </div>
            <div className="territory scroll-reveal scroll-reveal-delay-1">
              <div className="map">
                <div
                  className="asset has-image"
                  id="asset-13"
                  data-asset="13"
                  role="img"
                  aria-label="120 PIE 매장 상권 보호 구역 그래픽"
                >
                  <img
                    src={optimizeCloudinaryUrl(
                      "https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1794204306/120_PIE_%EC%B9%B4%ED%8E%98%EC%9D%98_%EB%85%B8%EB%9E%80_%EB%B3%B4%ED%98%B8_%EA%B5%AC%EC%97%AD_vogn53.png"
                    )}
                    alt="120 PIE 매장 상권 보호 구역 그래픽"
                    className="asset-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="ring">
                  <span>클라이언트 제안 조건</span>
                  <strong>반경 1km</strong>
                  <span>상권 보호 검토</span>
                </div>
                <small>
                  개념도 · 실제 보호 구역 또는 잔여 상권 지도가 아닙니다
                </small>
              </div>
              <div>
                <span className="pending">상권 보호 약정 확인 후 확정</span>
                <h3>
                  우리 동네 디저트, <br />
                  내가 먼저 시작할 수 있을까?
                </h3>
                <p style={{ color: "#4e450b" }}>
                  희망 지역과 매장 정보를 남겨주세요. <br />
                  도입 가능 여부와 인근 매장 현황, <br />
                  상권 보호 적용 조건을 상담합니다.
                </p>
                <p className="small">
                  반경 1km는 클라이언트가 제안한 조건으로 계약 확인 전입니다. 거리 산정·예외·계약 기간 확인 후 최종 반영합니다. 실제 마감이나 잔여 구역을 의미하지 않습니다.
                </p>
              </div>
            </div>
            <div className="scroll-reveal scroll-reveal-delay-2 territory-cta-wrap">
              <button
                type="button"
                className="cta"
                onClick={openConsultModal}
              >
                우리 동네 도입 가능 여부 확인<span>↗</span>
              </button>
            </div>
          </div>
        </section>

        {/* 9. PACKAGE */}
        <section className="s-package section white" id="package">
          <div className="wrap center">
            <div className="scroll-reveal">
              <span className="eyebrow">08 / 창업 및 도입 비용 안내</span>
              <h2>
                마음만 급하게 말고, <br />
                <u>조건과 비용까지 확실하게.</u>
              </h2>
              <p className="lead">
                내 매장 상황과 예산에 맞춰 가장 효과적인 모델을 선택하세요. <br />
                본사 공식 공시 기준 거품 없는 투명한 5가지 창업 플랜을 투명하게 안내합니다.
              </p>
            </div>

            {/* 5종 모델 탭 네비게이션 */}
            <div className="package-tabs scroll-reveal scroll-reveal-delay-1" role="tablist" aria-label="창업 모델 선택">
              {[
                { id: "shop120" as const, label: "샵인샵 (120pie)", badge: "디저트 단일", price: "440만원", desc: "120겹파이 올인원" },
                { id: "shopegg120" as const, label: "샵인샵 (egg120)", badge: "계란빵 단일", price: "330만원", desc: "에그120 프리미엄" },
                { id: "shopegg" as const, label: "샵인샵 (pie & egg)", badge: "파이+에그 듀얼", price: "690만원", desc: "결합 할인 80만원" },
                { id: "hybrid" as const, label: "하이브리드 창업", badge: "업종 전환", price: "980만원", desc: "기존 매장 리뉴얼" },
                { id: "franchise" as const, label: "신규 가맹 창업", badge: "15평 표준", price: "6,518만원", desc: "단독 가맹 표준 개설" },
              ].map((tab) => {
                const isActive = costTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`package-tab-btn${isActive ? " is-active" : ""}`}
                    onClick={() => setCostTab(tab.id)}
                  >
                    <span className="package-tab-badge">{tab.badge}</span>
                    <span className="package-tab-label">{tab.label}</span>
                    <span className="package-tab-price">{tab.price}</span>
                    <span className="package-tab-desc">{tab.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* 활성 탭별 상세 카드 */}
            <div className="package-card scroll-reveal scroll-reveal-delay-1">
              
              {/* 1. 샵인샵 (120pie) */}
              {costTab === "shop120" && (
                <>
                  <div className="package-card-header">
                    <div className="package-header-left">
                      <span className="package-header-badge">Shop-in-Shop Package</span>
                      <h3 className="package-header-title">120겹파이 올인원 패키지 도입 비용</h3>
                      <p className="package-header-desc">
                        자체 금형 전용 베이킹 머신과 초도 원재료, 홍보물 및 1:1 현장 조리 교육까지 원스톱 지원
                      </p>
                    </div>
                    <div className="package-header-right">
                      <div className="package-price-origin">정가 5,500,000원</div>
                      <div className="package-price-main">
                        <span className="package-price-tag">도입 할인가</span>
                        <strong className="package-price-num">440</strong>
                        <span className="package-price-unit">만원</span>
                      </div>
                      <div className="package-price-sub">VAT 포함 · 110만원 할인 적용</div>
                    </div>
                  </div>

                  <div className="package-row">
                    <span className="package-col-cat">전용 베이킹 인프라</span>
                    <span className="package-col-detail">자체 금형 오리지널 파이 머신 1ea</span>
                    <span className="package-col-note">120겹 파이 결을 살리는 전용 베이킹 머신</span>
                  </div>
                  <div className="package-row">
                    <span className="package-col-cat">초도 원재료 패키지</span>
                    <span className="package-col-detail">시그니처 패스트리 생지 1box + 프리미엄 필링 9종 각 1kg</span>
                    <span className="package-col-note">파이 약 200개 조리 분량 생지 및 필링 초도 지원</span>
                  </div>
                  <div className="package-row">
                    <span className="package-col-cat">매장 홍보물 세트</span>
                    <span className="package-col-detail">공식 실사 X배너 2종 + 카운터/테이블 POP 5종 + 홍보 포스터 8종</span>
                    <span className="package-col-note">매장 내외부 시선 집중 오프라인 홍보물 일체</span>
                  </div>
                  <div className="package-row">
                    <span className="package-col-cat">판매 촉진 비주얼 세트</span>
                    <span className="package-col-detail">실물 파이 모형 4종 + 배달 플랫폼(배민/쿠팡/요기요) 전용 실사 이미지</span>
                    <span className="package-col-note">쇼케이스 진열 모형 및 배달앱 등록용 고화질 컷</span>
                  </div>
                  <div className="package-row">
                    <span className="package-col-cat">운영 정착 밀착 지원</span>
                    <span className="package-col-detail">전용 포장 부자재 세트 + 본사 전문 인력 방문 머신 설치 및 1:1 조리 교육</span>
                    <span className="package-col-note">초보자도 15분 완성 가능한 1:1 현장 실습</span>
                  </div>
                  <div className="package-row is-highlight">
                    <span className="package-col-cat">매장 준비 조건</span>
                    <span className="package-col-detail">카운터 내 조리 공간 (가로 60cm 이상) · 220V 일반 전원 · 냉동고 (-18℃ 이하)</span>
                    <span className="package-col-note">기존 카페 주방에 즉시 배치 가능</span>
                  </div>
                  <div className="package-row is-highlight">
                    <span className="package-col-cat">상권 보호 정책</span>
                    <span className="package-col-detail">반경 1km 독점 보호망 및 1동 1점 원칙 철저 적용</span>
                    <span className="package-col-note">상담 신청 시 실시간 상권 조회</span>
                  </div>

                  <div className="package-card-action">
                    <div className="package-action-info">
                      <strong>120겹파이 단일 라인업으로 객단가와 마진을 극대화하세요.</strong> <br />
                      전화 문의: 1566-3594 · 선착순 상권 배정 진행 중
                    </div>
                    <button
                      type="button"
                      className="package-action-btn"
                      onClick={() => {
                        setStoreType("운영 중인 매장에 샵인샵 도입");
                        setModalStoreType("기존 카페 운영 중");
                        const el = document.getElementById("consult");
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth" });
                          setTimeout(() => ownerRef.current?.focus(), 450);
                        }
                      }}
                    >
                      120겹파이 샵인샵 상담 신청하기 ↗
                    </button>
                  </div>
                </>
              )}

              {/* 2. 샵인샵 (egg120) */}
              {costTab === "shopegg120" && (
                <>
                  <div className="package-card-header">
                    <div className="package-header-left">
                      <span className="package-header-badge">Shop-in-Shop Package</span>
                      <h3 className="package-header-title">에그120 프리미엄 패키지 도입 비용</h3>
                      <p className="package-header-desc">
                        10구 전용 조리 머신과 반죽 30kg, 토핑 4종, 동물복지 유정란 120알 초도 지원
                      </p>
                    </div>
                    <div className="package-header-right">
                      <div className="package-price-origin">정가 4,400,000원</div>
                      <div className="package-price-main">
                        <span className="package-price-tag">도입 할인가</span>
                        <strong className="package-price-num">330</strong>
                        <span className="package-price-unit">만원</span>
                      </div>
                      <div className="package-price-sub">VAT 포함 · 110만원 할인 적용</div>
                    </div>
                  </div>

                  <div className="package-row">
                    <span className="package-col-cat">전용 조리 인프라</span>
                    <span className="package-col-detail">에그120 계란빵 전용 머신 1대</span>
                    <span className="package-col-note">10구 동시 조리가 가능한 에그120 전용 기기</span>
                  </div>
                  <div className="package-row">
                    <span className="package-col-cat">초도 원재료 패키지</span>
                    <span className="package-col-detail">시그니처 전용 반죽 30kg + 토핑 식재료 4종 + 동물복지 유정란 120ea</span>
                    <span className="package-col-note">계란빵 약 720개 조리 분량 반죽 및 핵심 재료 초도 지원</span>
                  </div>
                  <div className="package-row">
                    <span className="package-col-cat">매장 홍보물 세트</span>
                    <span className="package-col-detail">공식 X배너 1ea + 테이블/카운터 POP 1ea + 홍보 포스터 3종</span>
                    <span className="package-col-note">매장 내외부 egg120 시그니처 홍보물 구성</span>
                  </div>
                  <div className="package-row">
                    <span className="package-col-cat">판매 촉진 비주얼 세트</span>
                    <span className="package-col-detail">계란빵 모형 4종 + 전용 미니 쇼케이스 + 동물복지 인증 매장 판넬</span>
                    <span className="package-col-note">카운터 진열 및 주문 유도를 위한 시각 자료 완비</span>
                  </div>
                  <div className="package-row">
                    <span className="package-col-cat">운영 정착 밀착 지원</span>
                    <span className="package-col-detail">배달 플랫폼 셋업 대행 + 포장/부자재 패키지 + 기기 설치 및 1:1 교육</span>
                    <span className="package-col-note">배달 3사 등록 대행 및 현장 조리 교육 포함</span>
                  </div>
                  <div className="package-row is-highlight">
                    <span className="package-col-cat">매장 준비 조건</span>
                    <span className="package-col-detail">카운터 즉석 조리 공간 · 220V 단독 전원 콘센트 · 냉장/냉동 보관 환경</span>
                    <span className="package-col-note">소형 매장 및 테이크아웃 창구 완벽 호환</span>
                  </div>
                  <div className="package-row is-highlight">
                    <span className="package-col-cat">상권 보호 정책</span>
                    <span className="package-col-detail">반경 1km 독점 보호망 및 1동 1점 원칙 철저 적용</span>
                    <span className="package-col-note">상담 신청 시 실시간 상권 조회</span>
                  </div>

                  <div className="package-card-action">
                    <div className="package-action-info">
                      <strong>사계절 남녀노소 사랑받는 프리미엄 계란빵 라인업을 확보하세요.</strong> <br />
                      전화 문의: 1566-3594 · 선착순 상권 배정 진행 중
                    </div>
                    <button
                      type="button"
                      className="package-action-btn"
                      onClick={() => {
                        setStoreType("운영 중인 매장에 샵인샵 도입");
                        setModalStoreType("기존 카페 운영 중");
                        const el = document.getElementById("consult");
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth" });
                          setTimeout(() => ownerRef.current?.focus(), 450);
                        }
                      }}
                    >
                      에그120 샵인샵 상담 신청하기 ↗
                    </button>
                  </div>
                </>
              )}

              {/* 3. 샵인샵 (pie & egg 듀얼 결합) */}
              {costTab === "shopegg" && (
                <>
                  <div className="package-card-header">
                    <div className="package-header-left">
                      <span className="package-header-badge">Dual Brand Package</span>
                      <h3 className="package-header-title">120겹파이 & 에그120 듀얼 결합 패키지 도입</h3>
                      <p className="package-header-desc">
                        파이 패키지(440만원) + 계란빵 패키지(330만원) 결합 시 80만원 특별 추가 할인 혜택
                      </p>
                    </div>
                    <div className="package-header-right">
                      <div className="package-price-origin">정상 합산 7,700,000원</div>
                      <div className="package-price-main">
                        <span className="package-price-tag">총 결합 도입가</span>
                        <strong className="package-price-num">690</strong>
                        <span className="package-price-unit">만원</span>
                      </div>
                      <div className="package-price-sub">VAT 포함 · 결합 특가 (80만원 할인)</div>
                    </div>
                  </div>

                  <div className="package-dual-wrap">
                    <div className="package-dual-box">
                      <div className="package-dual-box-header">
                        <h4 className="package-dual-box-title">120겹파이 올인원 패키지</h4>
                        <span className="package-dual-box-price">단독 440만원 구성</span>
                      </div>
                      <ul className="package-dual-list">
                        <li><strong>자체 금형 오리지널 파이 머신</strong> 1ea</li>
                        <li><strong>시그니처 패스트리 생지</strong> 1box (약 200개 분량)</li>
                        <li><strong>프리미엄 필링 9종</strong> 각 1kg (총 9kg)</li>
                        <li><strong>공식 실사 X배너 2종 + POP 5종 + 포스터 8종</strong></li>
                        <li><strong>실물 파이 모형 4종 + 배달앱 전용 실사 컷</strong></li>
                        <li><strong>전용 포장 부자재 세트 + 1:1 현장 조리 교육</strong></li>
                      </ul>
                    </div>

                    <div className="package-dual-box">
                      <div className="package-dual-box-header">
                        <h4 className="package-dual-box-title">에그120 프리미엄 패키지</h4>
                        <span className="package-dual-box-price">단독 330만원 구성</span>
                      </div>
                      <ul className="package-dual-list">
                        <li><strong>에그120 계란빵 10구 전용 머신</strong> 1대</li>
                        <li><strong>시그니처 전용 반죽 30kg</strong> (약 720개 분량)</li>
                        <li><strong>토핑 식재료 4종 + 동물복지 유정란</strong> 120ea</li>
                        <li><strong>공식 X배너 1ea + POP 1ea + 포스터 3종</strong></li>
                        <li><strong>계란빵 모형 4종 + 미니 쇼케이스 + 인증 판넬</strong></li>
                        <li><strong>배달 3사 셋업 대행 + 포장재 + 1:1 현장 교육</strong></li>
                      </ul>
                    </div>
                  </div>

                  <div className="package-row">
                    <span className="package-col-cat">올데이 매출 시너지</span>
                    <span className="package-col-detail">오전 식사/브런치 대용(에그120) + 오후 티타임/디저트(120겹파이) 완벽 연계</span>
                    <span className="package-col-note">오전부터 야간까지 빈틈없는 객단가 상승</span>
                  </div>
                  <div className="package-row">
                    <span className="package-col-cat">배달 플랫폼 통합 지원</span>
                    <span className="package-col-detail">배민·쿠팡이츠·요기요 양대 브랜드 듀얼 카테고리 입점 및 메뉴 세팅 무상 대행</span>
                    <span className="package-col-note">배달 매출 2배 확장 구조 세팅</span>
                  </div>
                  <div className="package-row is-highlight">
                    <span className="package-col-cat">상권 보호 정책</span>
                    <span className="package-col-detail">반경 1km 내 120겹파이 및 에그120 2개 브랜드 동시 독점권 확보</span>
                    <span className="package-col-note">우리 동네 유일 듀얼 매장 선점</span>
                  </div>

                  <div className="package-card-action">
                    <div className="package-action-info">
                      <strong>가장 많은 점주님들이 선택하시는 최고 인기 결합 패키지입니다.</strong> <br />
                      전화 문의: 1566-3594 · 선착순 상권 배정 진행 중
                    </div>
                    <button
                      type="button"
                      className="package-action-btn"
                      onClick={() => {
                        setStoreType("운영 중인 매장에 샵인샵 도입");
                        setModalStoreType("기존 카페 운영 중");
                        const el = document.getElementById("consult");
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth" });
                          setTimeout(() => ownerRef.current?.focus(), 450);
                        }
                      }}
                    >
                      듀얼 결합 패키지 상담 신청하기 ↗
                    </button>
                  </div>
                </>
              )}

              {/* 4. 하이브리드 창업 (업종 전환) */}
              {costTab === "hybrid" && (
                <>
                  <div className="package-card-header">
                    <div className="package-header-left">
                      <span className="package-header-badge">Hybrid Startup Model</span>
                      <h3 className="package-header-title">소자본 하이브리드 도입 비용 합계</h3>
                      <p className="package-header-desc">
                        기존 매장 인테리어와 집기를 100% 살려 간판·메뉴 교체만으로 완성하는 실속형 업종 전환 모델
                      </p>
                    </div>
                    <div className="package-header-right">
                      <div className="package-price-main">
                        <span className="package-price-tag">소자본 전환 비용</span>
                        <strong className="package-price-num">980</strong>
                        <span className="package-price-unit">만원</span>
                      </div>
                      <div className="package-price-sub">VAT 포함 · 월 로열티 면제</div>
                    </div>
                  </div>

                  <div className="package-hybrid-concept">
                    <div className="package-concept-pills">
                      <div className="package-concept-pill">
                        <strong>✓ 인테리어/주방 신설비 0원</strong>
                        <p>기존 인테리어, 냉장고, 싱크대, 커피 머신 등 기존 기물을 그대로 활용하여 공사비 거품을 제거합니다.</p>
                      </div>
                      <div className="package-concept-pill">
                        <strong>✓ 간판·사인물 교체 중심</strong>
                        <p>전면 돌출 실사 어닝 및 브랜드 외부 사인을 전면 교체하여 신규 매장의 강력한 시각적 효과를 냅니다.</p>
                      </div>
                      <div className="package-concept-pill">
                        <strong>✓ 월 고정 유지비 면제</strong>
                        <p>매월 고정적으로 나가는 가맹 로열티 및 관리 수수료를 영구 면제하여 점주님의 순수익을 극대화합니다.</p>
                      </div>
                    </div>
                  </div>

                  <div className="package-row">
                    <span className="package-col-cat">가맹비 (100만원)</span>
                    <span className="package-col-detail">120겹파이 브랜드에 대한 상권 내 독점 사용권, 본사 교육 및 개점 지원 등</span>
                    <span className="package-col-note">소멸성</span>
                  </div>
                  <div className="package-row">
                    <span className="package-col-cat">전용 장비 (150만원)</span>
                    <span className="package-col-detail">파이 머신, 계란빵 머신 외 주요 조리 전용 인프라 장비 일체</span>
                    <span className="package-col-note">기본 품목 외 별도</span>
                  </div>
                  <div className="package-row">
                    <span className="package-col-cat">간판 및 사인 (300만원)</span>
                    <span className="package-col-detail">전면 돌출 실사 어닝 및 공식 브랜드 외부 사인 일체</span>
                    <span className="package-col-note">현장 상황별 상이</span>
                  </div>
                  <div className="package-row">
                    <span className="package-col-cat">초도 물품 (300만원)</span>
                    <span className="package-col-detail">식재료, 원부자재, 유니폼, 메뉴판, 배너, 현수막, 시트지 및 각종 홍보물</span>
                    <span className="package-col-note">오픈 물품 일체</span>
                  </div>
                  <div className="package-row">
                    <span className="package-col-cat">런칭 홍보비 (130만원)</span>
                    <span className="package-col-detail">사전 이벤트, 네이버 플레이스 등록, 배달플랫폼(배민/쿠팡/요기요) 세팅 대행, SNS 및 타깃 마케팅</span>
                    <span className="package-col-note">초기 고객 유치 지원</span>
                  </div>
                  <div className="package-row is-highlight">
                    <span className="package-col-cat">총 합계 금액</span>
                    <span className="package-col-detail" style={{ fontWeight: 900, color: "#fa4a29" }}>980만원 (VAT 포함)</span>
                    <span className="package-col-note">월 고정 로열티 0원</span>
                  </div>

                  <div className="package-card-action">
                    <div className="package-action-info">
                      <strong>매출 정체 매장의 구원투수! 저비용 고효율 하이브리드 리뉴얼을 상담하세요.</strong> <br />
                      전화 문의: 1566-3594 · 실시간 매장 진단 지원
                    </div>
                    <button
                      type="button"
                      className="package-action-btn"
                      onClick={() => {
                        setStoreType("브랜드·업종 전환 검토");
                        setModalStoreType("업종 변경/리뉴얼");
                        const el = document.getElementById("consult");
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth" });
                          setTimeout(() => ownerRef.current?.focus(), 450);
                        }
                      }}
                    >
                      하이브리드 업종 전환 상담 신청하기 ↗
                    </button>
                  </div>
                </>
              )}

              {/* 5. 신규 가맹 창업 (15평 기준) */}
              {costTab === "franchise" && (
                <>
                  <div className="package-card-header">
                    <div className="package-header-left">
                      <span className="package-header-badge">Standard Franchise Estimate</span>
                      <h3 className="package-header-title">표준 창업 개설 비용 합계 (15평 기준)</h3>
                      <p className="package-header-desc">
                        15평 표준 매장 기준 기본 가맹 비용(1,040만)과 시설/인테리어 일체(5,478만)의 투명한 공시 내역
                      </p>
                    </div>
                    <div className="package-header-right">
                      <div className="package-price-main">
                        <span className="package-price-tag">표준 창업 합계</span>
                        <strong className="package-price-num">6,518</strong>
                        <span className="package-price-unit">만원</span>
                      </div>
                      <div className="package-price-sub">VAT 포함 · 15평 표준 기준</div>
                    </div>
                  </div>

                  <div className="package-franchise-wrap">
                    {/* 기본 비용 서브테이블 */}
                    <div className="package-subtable-box">
                      <div className="package-subtable-header">
                        <h4>기본 비용 명세</h4>
                        <span>1,040만원 (VAT 포함)</span>
                      </div>
                      <table className="package-subtable-table">
                        <thead>
                          <tr>
                            <th style={{ width: "26%" }}>구분</th>
                            <th style={{ width: "48%" }}>세부 내용</th>
                            <th style={{ width: "26%", textAlign: "right" }}>금액</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>가맹비</strong></td>
                            <td>상권 내 독점 사용권, 상표 사용권, 교육 및 개점 준비 지원 (소멸성)</td>
                            <td style={{ textAlign: "right", fontWeight: 800, color: "#fa4a29" }}>500만원</td>
                          </tr>
                          <tr>
                            <td><strong>초도 물품비</strong></td>
                            <td>원부자재 초도 패키지, 유니폼, 메뉴판, 배너, 홍보물 일체</td>
                            <td style={{ textAlign: "right", fontWeight: 800, color: "#fa4a29" }}>440만원</td>
                          </tr>
                          <tr>
                            <td><strong>계약이행 보증금</strong></td>
                            <td>가맹 계약 준수 및 이행을 위한 보증 자금 (만기 시 전액 환급)</td>
                            <td style={{ textAlign: "right", fontWeight: 800, color: "#fa4a29" }}>100만원</td>
                          </tr>
                          <tr>
                            <td><strong>로열티</strong></td>
                            <td>매월 고정 발생하는 가맹본부 상표권 및 시스템 이용료</td>
                            <td style={{ textAlign: "right", fontWeight: 800, color: "#fa4a29" }}>월 11만원</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* 기타 시설 비용 서브테이블 */}
                    <div className="package-subtable-box">
                      <div className="package-subtable-header">
                        <h4>시설 및 인테리어 비용</h4>
                        <span>5,478만원 (VAT 포함)</span>
                      </div>
                      <table className="package-subtable-table">
                        <thead>
                          <tr>
                            <th style={{ width: "30%" }}>구분</th>
                            <th style={{ width: "44%" }}>세부 내용</th>
                            <th style={{ width: "26%", textAlign: "right" }}>금액</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>인테리어 / 시설</strong></td>
                            <td>목공, 전기, 도장, 조명, 타일, 미장, 설계 및 감리 (15평 기준, 평당 190만원)</td>
                            <td style={{ textAlign: "right", fontWeight: 800, color: "#fa4a29" }}>2,850만원</td>
                          </tr>
                          <tr>
                            <td><strong>주방 / 집기류</strong></td>
                            <td>오븐기, 베이킹 머신, 싱크대, 디스펜서, 제빙기, 냉장고 등 기본 세팅</td>
                            <td style={{ textAlign: "right", fontWeight: 800, color: "#fa4a29" }}>2,200만원</td>
                          </tr>
                          <tr>
                            <td><strong>간판 및 사인물</strong></td>
                            <td>전면 LED 채널 간판, 돌출 간판, 내부 그래픽 사인 일체</td>
                            <td style={{ textAlign: "right", fontWeight: 800, color: "#fa4a29" }}>330만원</td>
                          </tr>
                          <tr>
                            <td><strong>기타 집기</strong></td>
                            <td>키오스크 무인 결제기, 포스(POS), 주방 관련 소집기, 홀 의탁자</td>
                            <td style={{ textAlign: "right", fontWeight: 800, color: "#fa4a29" }}>440만원</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="package-card-action">
                    <div className="package-action-info">
                      <strong>자체 인테리어 직접 시공 가능 (도면 설계 및 감리비 별도). 15평형 표준 단독 매장 개설.</strong> <br />
                      전화 문의: 1566-3594 · 추천 입지 상권 브리핑 지원
                    </div>
                    <button
                      type="button"
                      className="package-action-btn"
                      onClick={() => {
                        setStoreType("신규 오픈 준비");
                        setModalStoreType("신규 창업 준비 중");
                        const el = document.getElementById("consult");
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth" });
                          setTimeout(() => ownerRef.current?.focus(), 450);
                        }
                      }}
                    >
                      15평 가맹 창업 상담 신청하기 ↗
                    </button>
                  </div>
                </>
              )}

            </div>

            {/* 개설 유의사항 안내 박스 */}
            <div className="package-notes-box scroll-reveal scroll-reveal-delay-2">
              <div className="package-notes-title">
                <span>⚠️</span>
                <span>개설 유의사항 및 기본 안내</span>
              </div>
              <ul className="package-notes-list">
                <li>
                  신규 가맹 창업 비용은 15평 표준 매장을 기준으로 설계되었으며 점포의 실면적, 상권 입지 조건, 건물 노후화 등에 따라 공사 항목별 금액 변동이 있을 수 있습니다.
                </li>
                <li>
                  인테리어 시공은 점주님께서 알고 계신 업체를 통하여 <strong>자체 직접 시공</strong>(개별 인테리어)이 가능하며, 이 경우 본사의 도면 설계 및 정밀 감리 비용이 별도로 발생합니다.
                </li>
                <li>
                  별도 공사항목(외부 가스 관로 인입 및 계량기 신설, 주방 메인 급배수 배관설비 신설, 전기 증설 및 승압 공사, 냉난방 기기 도입, 철거 및 소방 인허가 등)은 임차 점포 조건에 따라 본사 별도 정산 또는 개인 시공을 필요로 합니다.
                </li>
              </ul>
            </div>

            {/* 자주 묻는 질문 (FAQ) */}
            <div className="faq scroll-reveal scroll-reveal-delay-2">
              <details>
                <summary>기존 카페 운영 중인데 샵인샵 3종(파이, 에그, 듀얼) 중 어떤 패키지가 가장 알맞나요?</summary>
                <p>
                  커피 주문 고객의 디저트 부가 주문율과 객단가 상승이 목적이라면 <strong>120겹파이 단일(440만원)</strong>,
                  출근길 직장인 및 학생 테이크아웃 간식 수요가 높은 상권이라면 <strong>egg120(330만원)</strong>을 권장합니다.
                  오전 식사 대용부터 오후 티타임까지 올데이 매출을 공략하고 80만원 특별 결합 할인 혜택을 누리시려면 <strong>듀얼 패키지(690만원)</strong>의 만족도가 가장 높습니다.
                </p>
              </details>
              <details>
                <summary>기존 매장을 운영 중인데 하이브리드(업종 전환)는 어떻게 진행되나요?</summary>
                <p>
                  기존 매장의 인테리어와 냉장고, 싱크대, 커피 머신 등 사용 가능한 집기를 최대한 그대로 유지합니다.
                  외부 전면 돌출 어닝 및 브랜드 간판 사인 전면 교체, 파이/계란빵 조리 인프라 머신 입고, 초도 원부자재 세팅과 배달 3사(배민/쿠팡/요기요) 등록 대행까지 총 <strong>980만원(VAT 포함)</strong>으로 불필요한 공사비와 월 로열티 부담 없이 빠르고 경제적인 브랜드 전환을 완성합니다.
                </p>
              </details>
              <details>
                <summary>신규 가맹 매장 창업 시 인테리어를 자체 직접 시공해도 되나요?</summary>
                <p>
                  네, 얼마든지 가능합니다. 점주님께서 신뢰하시는 시공 업체를 통해 <strong>개별 직접 시공</strong>하실 수 있으며,
                  이 경우 본사의 120PIE 공식 표준 디자인 설계 도면 제공 및 정밀 감리 비용만 별도로 정산되어 인테리어 비용을 크게 절감하실 수 있습니다.
                </p>
              </details>
              <details>
                <summary>상권 보호(1동 1점 / 반경 1km 독점)는 어떻게 보장되나요?</summary>
                <p>
                  120PIE는 가맹점주의 상권 내 매출과 수익을 끝까지 보호하기 위해 반경 1km 및 1동 1점 상권 보호제를 철저히 준수합니다.
                  상담 신청 시 희망 매장 주소를 알려주시면 본사 상권분석 전산 시스템으로 해당 구역 계약 가능 여부를 즉시 확인해 드립니다.
                </p>
              </details>
              <details>
                <summary>상담을 신청하면 바로 계약해야 하나요?</summary>
                <p>
                  전혀 아닙니다. 상담 신청 시 전문 창업 컨설턴트가 배정되어 우리 동네 상권 분석 현황, 점포 실측 가이드, 예상 마진율과 무료 시식 및 장비 시연 기회를 먼저 제공합니다. 충분히 검토하시고 확신이 드셨을 때 계약을 결정하시면 됩니다.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* 10. CONSULT */}
        <section className="s-consult consult" id="consult" ref={consultRef}>
          <div className="wrap center">
            <div className="scroll-reveal">
              <span className="eyebrow">다음 메뉴는 고민 중. 다음 행동은 지금.</span>
              <h2>
                <span className="title-line">우리 동네 디저트 손님,</span>
                <span className="title-line">누가 먼저 잡을까요?</span>
              </h2>
              <p className="lead">
                내 매장에 맞는 메뉴부터 도입 조건까지. <br />
                <b>우리 지역에서 시작할 수 있는지 확인하세요.</b>
              </p>
            </div>
            <form
              className="form scroll-reveal scroll-reveal-delay-1"
              id="demo-form"
              noValidate
              aria-busy={isSubmitting}
              onSubmit={handleSubmit}
            >
              <div className="form-grid">
                <label htmlFor="owner">
                  성함
                  <input
                    ref={ownerRef}
                    id="owner"
                    name="name"
                    autoComplete="name"
                    placeholder="성함"
                    required
                    value={name}
                    aria-invalid={Boolean(errors.owner)}
                    aria-describedby="owner-error"
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.owner) setErrors((p) => ({ ...p, owner: "" }));
                      if (!isSubmitting && statusMessage) {
                        setStatusMessage("");
                        setSubmitStatus("");
                      }
                    }}
                  />
                  <span
                    className="field-error"
                    id="owner-error"
                    data-editorial="true"
                  >
                    {errors.owner}
                  </span>
                </label>

                <label htmlFor="phone">
                  연락처
                  <input
                    ref={phoneRef}
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={14}
                    placeholder="010-0000-0000"
                    required
                    value={phone}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby="phone-error"
                    onChange={(e) => {
                      setPhone(formatPhoneInput(e.target.value));
                      if (errors.phone) setErrors((p) => ({ ...p, phone: "" }));
                      if (!isSubmitting && statusMessage) {
                        setStatusMessage("");
                        setSubmitStatus("");
                      }
                    }}
                  />
                  <span
                    className="field-error"
                    id="phone-error"
                    data-editorial="true"
                  >
                    {errors.phone}
                  </span>
                </label>

                <label htmlFor="region">
                  희망 도입 지역
                  <input
                    ref={regionRef}
                    id="region"
                    name="region"
                    placeholder="예: 서울 마포구 합정동"
                    required
                    value={region}
                    aria-invalid={Boolean(errors.region)}
                    aria-describedby="region-error"
                    onChange={(e) => {
                      setRegion(e.target.value);
                      if (errors.region) setErrors((p) => ({ ...p, region: "" }));
                      if (!isSubmitting && statusMessage) {
                        setStatusMessage("");
                        setSubmitStatus("");
                      }
                    }}
                  />
                  <span
                    className="field-error"
                    id="region-error"
                    data-editorial="true"
                  >
                    {errors.region}
                  </span>
                </label>

                <label htmlFor="type">
                  현재 매장 상황
                  <select
                    ref={typeRef}
                    id="type"
                    name="type"
                    required
                    value={storeType}
                    aria-invalid={Boolean(errors.type)}
                    aria-describedby="type-error"
                    onChange={(e) => {
                      setStoreType(e.target.value);
                      if (errors.type) setErrors((p) => ({ ...p, type: "" }));
                      if (!isSubmitting && statusMessage) {
                        setStatusMessage("");
                        setSubmitStatus("");
                      }
                    }}
                  >
                    <option value="">선택해주세요</option>
                    <option value="운영 중인 매장에 샵인샵 도입">
                      운영 중인 매장에 샵인샵 도입
                    </option>
                    <option value="브랜드·업종 전환 검토">
                      브랜드·업종 전환 검토
                    </option>
                    <option value="신규 오픈 준비">신규 오픈 준비</option>
                  </select>
                  <span
                    className="field-error"
                    id="type-error"
                    data-editorial="true"
                  >
                    {errors.type}
                  </span>
                </label>
              </div>

              <label className="check">
                <input
                  ref={consentRef}
                  id="demo-consent"
                  type="checkbox"
                  required
                  checked={consent}
                  aria-invalid={Boolean(errors.consent)}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    if (errors.consent) setErrors((p) => ({ ...p, consent: "" }));
                    if (!isSubmitting && statusMessage) {
                      setStatusMessage("");
                      setSubmitStatus("");
                    }
                  }}
                />
                <span>
                  개인정보 수집·이용 안내를 확인했으며 상담 접수에 동의합니다. <br />
                  수집주체: (주)고우웰라이프 · 항목: 성함, 연락처, 희망 도입 지역, 현재 매장 상황 · 목적: 도입 상담 및 안내 · 보유기간: 상담 목적 달성 시 파기
                </span>
              </label>

              <button type="submit" className="cta" disabled={isSubmitting}>
                우리 지역 도입 상담 신청<span>↗</span>
              </button>

              <p className="small">
                입력하신 정보는 (주)고우웰라이프 상담 시스템에 안전하게 저장되며 담당자에게 전달됩니다. (문의 1566-3594)
              </p>

              <p
                className="field-error"
                id="consent-error"
                data-editorial="true"
              >
                {errors.consent}
              </p>

              <p
                ref={messageRef}
                id="message"
                role="status"
                aria-live="polite"
                data-status={submitStatus || undefined}
              >
                {statusMessage}
              </p>
            </form>
          </div>
        </section>
      </main>

      <Footer
        hidePortalBox={true}
        className="pb-28 sm:pb-32"
        logoStyle={{ height: "24px", width: "auto", maxWidth: "180px", objectFit: "contain", display: "block" }}
      />

      <div
        className={`fixed${fixedHidden ? " is-hidden" : ""}`}
        id="fixed-cta"
      >
        <div className="wrap">
          <strong>
            우리 동네, 내가 먼저.
            <small>(주)고우웰라이프 · 실시간 상담 접수 연동</small>
          </strong>
          <button
            type="button"
            className="cta"
            onClick={openConsultModal}
            style={{ cursor: "pointer", border: 0 }}
          >
            우리 지역 도입 가능 여부 확인<span>↗</span>
          </button>
        </div>
      </div>

      {/* CONSULTATION POPUP MODAL */}
      {isConsultModalOpen && (
        <div
          className="consult-modal-backdrop"
          onClick={closeConsultModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="consult-modal-title"
        >
          <div
            className="consult-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="consult-modal-close"
              onClick={closeConsultModal}
              aria-label="팝업 닫기"
            >
              ×
            </button>

            {modalSubmitStatus === "success" ? (
              <div className="consult-modal-success">
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                  <img
                    src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784533894/Group_1_4_jl4rlr.png"
                    alt="120PIE 로고"
                    style={{ height: "26px", width: "auto", maxWidth: "160px", objectFit: "contain", display: "block" }}
                  />
                </div>
                <div className="consult-modal-success-icon">✓</div>
                <h3>상담 신청이 접수되었습니다</h3>
                <p>
                  {modalStatusMessage ||
                    "희망 지역의 상권 현황 및 도입 조건을 신속히 확인하여 연락드리겠습니다."}
                </p>
                <button
                  type="button"
                  className="cta"
                  onClick={closeConsultModal}
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  확인
                </button>
              </div>
            ) : (
              <>
                <div className="consult-modal-header">
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "14px" }}>
                    <img
                      src="https://res.cloudinary.com/lyjyvy54/image/upload/f_auto,q_auto/v1784533894/Group_1_4_jl4rlr.png"
                      alt="120PIE 로고"
                      style={{ height: "24px", width: "auto", maxWidth: "160px", objectFit: "contain", display: "block" }}
                    />
                  </div>
                  <span className="consult-modal-badge">07 / 상권 보호 및 도입 상담</span>
                  <h3 id="consult-modal-title" className="consult-modal-title">
                    우리 동네 디저트, <br />
                    도입 가능 여부 확인
                  </h3>
                  <p className="consult-modal-desc">
                    희망 지역과 매장 정보를 남겨주시면, 인근 매장 현황과 상권 보호 반경 적용 조건을 빠르게 안내해 드립니다.
                  </p>
                </div>

                <form onSubmit={handleModalSubmit} noValidate>
                  <div className="form-grid">
                    <label htmlFor="modal-owner">
                      성함
                      <input
                        id="modal-owner"
                        name="name"
                        autoComplete="name"
                        placeholder="성함"
                        required
                        value={modalName}
                        aria-invalid={Boolean(modalErrors.owner)}
                        onChange={(e) => {
                          setModalName(e.target.value);
                          if (modalErrors.owner) setModalErrors((p) => ({ ...p, owner: "" }));
                        }}
                      />
                      <span className="field-error">{modalErrors.owner}</span>
                    </label>

                    <label htmlFor="modal-phone">
                      연락처
                      <input
                        id="modal-phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        maxLength={14}
                        placeholder="010-0000-0000"
                        required
                        value={modalPhone}
                        aria-invalid={Boolean(modalErrors.phone)}
                        onChange={(e) => {
                          setModalPhone(formatPhoneInput(e.target.value));
                          if (modalErrors.phone) setModalErrors((p) => ({ ...p, phone: "" }));
                        }}
                      />
                      <span className="field-error">{modalErrors.phone}</span>
                    </label>

                    <label htmlFor="modal-region">
                      희망 도입 지역
                      <input
                        id="modal-region"
                        name="region"
                        placeholder="예: 서울 마포구 합정동"
                        required
                        value={modalRegion}
                        aria-invalid={Boolean(modalErrors.region)}
                        onChange={(e) => {
                          setModalRegion(e.target.value);
                          if (modalErrors.region) setModalErrors((p) => ({ ...p, region: "" }));
                        }}
                      />
                      <span className="field-error">{modalErrors.region}</span>
                    </label>

                    <label htmlFor="modal-store-type">
                      현재 매장 상황
                      <select
                        id="modal-store-type"
                        name="storeType"
                        value={modalStoreType}
                        aria-invalid={Boolean(modalErrors.type)}
                        onChange={(e) => {
                          setModalStoreType(e.target.value);
                          if (modalErrors.type) setModalErrors((p) => ({ ...p, type: "" }));
                        }}
                      >
                        <option value="기존 카페 운영 중">기존 카페 운영 중 (디저트 라인업 추가)</option>
                        <option value="신규 창업 준비 중">신규 카페 창업 준비 중</option>
                        <option value="업종 변경/리뉴얼">기타 외식업 운영 (업종 변경/리뉴얼)</option>
                        <option value="기타/단독 매장">기타 / 전용 매장 오픈 검토</option>
                      </select>
                      <span className="field-error">{modalErrors.type}</span>
                    </label>
                  </div>

                  <label className="check" htmlFor="modal-consent">
                    <input
                      type="checkbox"
                      id="modal-consent"
                      name="consent"
                      checked={modalConsent}
                      aria-invalid={Boolean(modalErrors.consent)}
                      onChange={(e) => {
                        setModalConsent(e.target.checked);
                        if (modalErrors.consent) setModalErrors((p) => ({ ...p, consent: "" }));
                      }}
                    />
                    <span>
                      [필수] 개인정보 수집 및 이용 동의 (상권 분석 및 도입 상담 안내 목적)
                    </span>
                  </label>
                  <span className="field-error" style={{ marginBottom: "12px", display: "block" }}>
                    {modalErrors.consent}
                  </span>

                  {modalSubmitStatus === "error" && (
                    <div className="status-msg is-error" style={{ marginBottom: "16px" }}>
                      {modalStatusMessage}
                    </div>
                  )}

                  {modalSubmitStatus === "duplicate" && (
                    <div className="status-msg is-duplicate" style={{ marginBottom: "16px" }}>
                      {modalStatusMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="cta"
                    disabled={modalIsSubmitting}
                  >
                    <span>{modalIsSubmitting ? "접수 진행 중..." : "상담 신청하기"}</span>
                    <span>↗</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
