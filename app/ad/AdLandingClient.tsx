"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import "./styles.css";
import { optimizeCloudinaryUrl } from "../utils/cloudinary";

type SubmitStatus = "" | "pending" | "success" | "duplicate" | "error";

export default function AdLandingClient() {
  const heroRef = useRef<HTMLElement | null>(null);
  const consultRef = useRef<HTMLElement | null>(null);
  const guideRef = useRef<HTMLDialogElement | null>(null);
  const messageRef = useRef<HTMLParagraphElement | null>(null);

  const ownerRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const regionRef = useRef<HTMLInputElement | null>(null);
  const typeRef = useRef<HTMLSelectElement | null>(null);
  const consentRef = useRef<HTMLInputElement | null>(null);

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
    const guideEl = guideRef.current;
    if (!heroEl || !consultEl) return;

    const formFocus = consultEl.contains(document.activeElement);
    const isGuideOpen = Boolean(guideEl?.open);
    const shouldHide =
      heroEl.getBoundingClientRect().bottom > 100 ||
      consultEl.getBoundingClientRect().top < window.innerHeight ||
      formFocus ||
      isGuideOpen;

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

  const openGuide = () => {
    const dialog = guideRef.current;
    if (dialog && typeof dialog.showModal === "function" && !dialog.open) {
      dialog.showModal();
      updateFixed();
    }
  };

  const closeGuide = () => {
    const dialog = guideRef.current;
    if (dialog && dialog.open) {
      dialog.close();
      updateFixed();
    }
  };

  const handleDialogBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = guideRef.current;
    if (!dialog || e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    ) {
      closeGuide();
    }
  };

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
      <div className="notice">
        클라이언트 검토용 카피·구성 시안 · 상담 신청은 (주)고우웰라이프 상담 시스템으로 실제 접수됩니다 · 실적 및 상권 보호 조건은 자료 확인 후 확정
      </div>
      <header className="bar" id="top">
        <div className="wrap">
          <a className="brand" href="#top" aria-label="120PIE 처음으로">
            120<span>PIE</span>
          </a>
          <div className="header-actions">
            <button
              className="guide-open"
              type="button"
              data-editorial="true"
              onClick={openGuide}
            >
              이미지 가이드 <span>13</span>
            </button>
            <a className="header-cta" href="#consult">
              우리 지역 도입 상담 ↗
            </a>
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
            <a className="cta" href="#consult">
              우리 동네 도입 가능 여부 확인<span>↗</span>
            </a>
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
          <div className="wrap">
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
            <div className="comparison">
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
            <span className="eyebrow">02 / 매장 선택의 근거</span>
            <h2>
              한 매장의 아이디어를 넘어, <br />
              <span className="yellow">전국으로 퍼진 파이.</span>
            </h2>
            <div className="large-stat">
              200<small>호점</small>
            </div>
            <span className="pending">
              공식 홈페이지 게시 수치 · 집계 범위·기준일 확인 예정
            </span>
            <p className="lead" style={{ marginTop: "25px" }}>
              내 매장에도 맞을까? <br />
              중요한 건 숫자 다음의 이야기입니다. <br />
              어떤 매장이, 어떻게 판매하고 운영하는지 확인하세요.
            </p>
            <div className="proof-grid">
              <div className="proof">
                <div
                  className="asset"
                  id="asset-02"
                  data-editorial="true"
                  data-asset="02"
                  role="img"
                  aria-label="실제 도입 매장 삽입 영역"
                >
                  <div className="asset-top">
                    <span>IMAGE 02</span>
                    <span>4:3</span>
                  </div>
                  <div className="asset-center">
                    <span className="asset-cross" aria-hidden="true">
                      ＋
                    </span>
                    <strong>실제 도입 매장</strong>
                    <p>장비와 작업대가 함께 보이는 실제 매장 사진</p>
                  </div>
                  <div className="asset-bottom">
                    <span>1200 × 900 px</span>
                    <span>필수</span>
                  </div>
                </div>
                <div className="proof-copy">
                  <span className="num">CHECK 01</span>
                  <b>실제 도입 매장</b>
                  <p>
                    기존 카페에 어떻게 설치하고 <br />
                    어떤 메뉴로 시작했는지.
                  </p>
                </div>
              </div>
              <div className="proof">
                <div
                  className="asset"
                  id="asset-03"
                  data-editorial="true"
                  data-asset="03"
                  role="img"
                  aria-label="실제 운영 장면 삽입 영역"
                >
                  <div className="asset-top">
                    <span>IMAGE 03</span>
                    <span>4:3</span>
                  </div>
                  <div className="asset-center">
                    <span className="asset-cross" aria-hidden="true">
                      ＋
                    </span>
                    <strong>실제 운영 장면</strong>
                    <p>점주가 파이를 굽거나 포장하는 장면</p>
                  </div>
                  <div className="asset-bottom">
                    <span>1200 × 900 px</span>
                    <span>권장</span>
                  </div>
                </div>
                <div className="proof-copy">
                  <span className="num">CHECK 02</span>
                  <b>실제 운영 경험</b>
                  <p>
                    조리·보관·피크타임 대응은 <br />
                    어떻게 하고 있는지.
                  </p>
                </div>
              </div>
              <div className="proof">
                <div
                  className="asset"
                  id="asset-04"
                  data-editorial="true"
                  data-asset="04"
                  role="img"
                  aria-label="실제 판매 자료 삽입 영역"
                >
                  <div className="asset-top">
                    <span>IMAGE 04</span>
                    <span>4:3</span>
                  </div>
                  <div className="asset-center">
                    <span className="asset-cross" aria-hidden="true">
                      ＋
                    </span>
                    <strong>실제 판매 자료</strong>
                    <p>매장·기간을 확인할 수 있는 판매 자료</p>
                  </div>
                  <div className="asset-bottom">
                    <span>1200 × 900 px</span>
                    <span>자료 확인</span>
                  </div>
                </div>
                <div className="proof-copy">
                  <span className="num">CHECK 03</span>
                  <b>실제 판매 자료</b>
                  <p>
                    홀·포장·배달에서 <br />
                    어떤 반응을 얻고 있는지.
                  </p>
                </div>
              </div>
            </div>
            <div className="review-note">
              최종 콘텐츠: 실제 도입 매장 사진·점주 인터뷰·운영 자료 삽입. ‘전국 200개 샵인샵’ 표현은 샵인샵만의 집계가 확인된 뒤 사용합니다.
            </div>
          </div>
        </section>

        {/* 4. MENU */}
        <section className="s-menu section yellow-section" id="menu">
          <div className="wrap">
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
            <div className="menu-grid">
              <article>
                <div className="menu-photo">
                  <div
                    className="asset"
                    id="asset-05"
                    data-editorial="true"
                    data-asset="05"
                    role="img"
                    aria-label="애플파이 삽입 영역"
                  >
                    <div className="asset-top">
                      <span>IMAGE 05</span>
                      <span>4:5</span>
                    </div>
                    <div className="asset-center">
                      <span className="asset-cross" aria-hidden="true">
                        ＋
                      </span>
                      <strong>애플파이</strong>
                      <p>페이스트리 결·사과 필링이 보이는 단면</p>
                    </div>
                    <div className="asset-bottom">
                      <span>1200 × 1500 px</span>
                      <span>필수</span>
                    </div>
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
              <article>
                <div className="menu-photo">
                  <div
                    className="asset"
                    id="asset-06"
                    data-editorial="true"
                    data-asset="06"
                    role="img"
                    aria-label="불고기파이 삽입 영역"
                  >
                    <div className="asset-top">
                      <span>IMAGE 06</span>
                      <span>4:5</span>
                    </div>
                    <div className="asset-center">
                      <span className="asset-cross" aria-hidden="true">
                        ＋
                      </span>
                      <strong>불고기파이</strong>
                      <p>불고기 필링과 제품 크기가 드러나는 컷</p>
                    </div>
                    <div className="asset-bottom">
                      <span>1200 × 1500 px</span>
                      <span>필수</span>
                    </div>
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
              <article>
                <div className="menu-photo">
                  <div
                    className="asset"
                    id="asset-07"
                    data-editorial="true"
                    data-asset="07"
                    role="img"
                    aria-label="페페로니 피자파이 삽입 영역"
                  >
                    <div className="asset-top">
                      <span>IMAGE 07</span>
                      <span>4:5</span>
                    </div>
                    <div className="asset-center">
                      <span className="asset-cross" aria-hidden="true">
                        ＋
                      </span>
                      <strong>페페로니 피자파이</strong>
                      <p>치즈와 페페로니가 보이는 제품 단면</p>
                    </div>
                    <div className="asset-bottom">
                      <span>1200 × 1500 px</span>
                      <span>필수</span>
                    </div>
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
            <div
              className="asset"
              id="asset-08"
              data-editorial="true"
              data-asset="08"
              role="img"
              aria-label="실제 조리 영상 삽입 영역"
            >
              <div className="asset-top">
                <span>VIDEO 08</span>
                <span>16:9</span>
              </div>
              <div className="asset-center">
                <span className="asset-cross" aria-hidden="true">
                  ＋
                </span>
                <strong>실제 조리 영상</strong>
                <p>준비 → 굽기 → 포장, 끊김 없이 보여주는 실제 과정</p>
              </div>
              <div className="asset-bottom">
                <span>1920 × 1080 px · MP4</span>
                <span>필수</span>
              </div>
            </div>
            <div className="step-grid">
              <div className="step">
                <span className="number">01</span>
                <h3>준비하고</h3>
                <p>
                  공급 제품과 필링을 <br />
                  매뉴얼에 맞춰 준비.
                </p>
              </div>
              <div className="step">
                <span className="number">02</span>
                <h3>굽고</h3>
                <p>
                  전용 장비와 조리 교육으로 <br />
                  매장에서 파이를 완성.
                </p>
              </div>
              <div className="step">
                <span className="number">03</span>
                <h3>담아내고</h3>
                <p>
                  커피 세트 또는 포장 메뉴로 <br />
                  고객에게 제안.
                </p>
              </div>
            </div>
            <p className="punch">
              복잡한 기술보다, <br />
              <span className="yellow">반복할 수 있는 운영이 먼저입니다.</span>
            </p>
            <div className="review-note">
              이 구간에는 실제 준비 → 굽기 → 포장 영상을 배치합니다. ‘와플처럼 간편한 조리’는 영상으로 전달하고, 정확한 조리 시간·전처리·청소 조건은 확인 후 표기합니다.
            </div>
          </div>
        </section>

        {/* 6. REVIEWS */}
        <section className="s-reviews section white" id="reviews">
          <div className="wrap">
            <span className="eyebrow">05 / 고객의 선택을 증명</span>
            <h2>
              본사 말 백 마디보다, <br />
              고객이 남긴 <u>한 줄.</u>
            </h2>
            <p className="lead">
              맛은 설명할 수 있습니다. <br />
              다시 찾는 이유는 고객의 목소리로 보여줘야 합니다.
            </p>
            <div className="reviews">
              <article className="review">
                <small>고객 반응 · 배치 예시</small>
                <h3>
                  “왜 이 파이를 골랐는가”를 <br />
                  보여주는 실제 후기.
                </h3>
                <p>
                  맛·식감·커피와의 조합이 드러나는 리뷰를 <br />
                  원문 그대로 배치할 예정입니다.
                </p>
                <div
                  className="asset"
                  id="asset-09"
                  data-editorial="true"
                  data-asset="09"
                  role="img"
                  aria-label="실제 구매 고객 리뷰 삽입 영역"
                >
                  <div className="asset-top">
                    <span>IMAGE 09</span>
                    <span>4:3</span>
                  </div>
                  <div className="asset-center">
                    <span className="asset-cross" aria-hidden="true">
                      ＋
                    </span>
                    <strong>실제 구매 고객 리뷰</strong>
                    <p>맛·식감·커피와의 조합이 드러나는 원문</p>
                  </div>
                  <div className="asset-bottom">
                    <span>1200 × 900 px</span>
                    <span>필수</span>
                  </div>
                </div>
                <div className="empty">실제 리뷰 캡처 삽입 예정</div>
              </article>
              <article className="review">
                <small>구매 경험 · 배치 예시</small>
                <h3>
                  “포장 후에도 만족했는가”를 <br />
                  보여주는 실제 후기.
                </h3>
                <p>
                  포장 상태·배달 경험·재주문 이유를 <br />
                  확인할 수 있는 리뷰를 배치할 예정입니다.
                </p>
                <div
                  className="asset"
                  id="asset-10"
                  data-editorial="true"
                  data-asset="10"
                  role="img"
                  aria-label="실제 포장·배달 리뷰 삽입 영역"
                >
                  <div className="asset-top">
                    <span>IMAGE 10</span>
                    <span>4:3</span>
                  </div>
                  <div className="asset-center">
                    <span className="asset-cross" aria-hidden="true">
                      ＋
                    </span>
                    <strong>실제 포장·배달 리뷰</strong>
                    <p>포장 상태와 재주문 이유가 드러나는 원문</p>
                  </div>
                  <div className="asset-bottom">
                    <span>1200 × 900 px</span>
                    <span>필수</span>
                  </div>
                </div>
                <div className="empty">실제 배달 리뷰 삽입 예정</div>
              </article>
            </div>
            <p className="small">
              위 문장은 고객 인용이 아닌 콘텐츠 배치 설명입니다. 리뷰 원문·출처·사용 권한 확인 후 교체합니다.
            </p>
          </div>
        </section>

        {/* 7. DELIVERY */}
        <section className="s-delivery section" id="delivery">
          <div className="wrap">
            <span className="eyebrow">06 / 매장 밖의 주문까지</span>
            <h2>
              홀 손님만 기다릴 건가요? <br />
              <span className="yellow">
                배달앱에도 <br />
                우리 파이를 띄우세요.
              </span>
            </h2>
            <div className="split">
              <div className="photo">
                <div
                  className="asset"
                  id="asset-11"
                  data-editorial="true"
                  data-asset="11"
                  role="img"
                  aria-label="포장·커피 세트 삽입 영역"
                >
                  <div className="asset-top">
                    <span>IMAGE 11</span>
                    <span>4:5</span>
                  </div>
                  <div className="asset-center">
                    <span className="asset-cross" aria-hidden="true">
                      ＋
                    </span>
                    <strong>포장·커피 세트</strong>
                    <p>실제 판매 가능한 구성과 패키지를 함께 촬영</p>
                  </div>
                  <div className="asset-bottom">
                    <span>1200 × 1500 px</span>
                    <span>필수</span>
                  </div>
                </div>
                <div
                  className="asset phone-asset"
                  id="asset-12"
                  data-editorial="true"
                  data-asset="12"
                  role="img"
                  aria-label="실제 배달앱 메뉴 화면 삽입 영역"
                >
                  <div className="asset-top">
                    <span>IMAGE 12</span>
                    <span>9:16</span>
                  </div>
                  <div className="asset-center">
                    <span className="asset-cross" aria-hidden="true">
                      ＋
                    </span>
                    <strong>실제 배달앱 메뉴 화면</strong>
                    <p>운영 중인 매장의 메뉴 화면, 개인정보는 제외</p>
                  </div>
                  <div className="asset-bottom">
                    <span>1080 × 1920 px</span>
                    <span>권장</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="lead">
                  한 가지 제품을, <br />더 많은 주문 장면으로.
                </p>
                <ul className="checks">
                  <li>커피와 함께 제안하는 세트 구성</li>
                  <li>집과 사무실로 가져가는 포장 메뉴</li>
                  <li>배달 메뉴판에 추가할 디저트 선택지</li>
                </ul>
                <a className="cta" href="#consult">
                  우리 매장 판매 구성 상담<span>↗</span>
                </a>
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
            <div className="territory">
              <div className="map">
                <div
                  className="asset"
                  id="asset-13"
                  data-editorial="true"
                  data-asset="13"
                  role="img"
                  aria-label="상권 보호 안내 그래픽 삽입 영역"
                >
                  <div className="asset-top">
                    <span>IMAGE 13</span>
                    <span>4:3</span>
                  </div>
                  <div className="asset-center">
                    <span className="asset-cross" aria-hidden="true">
                      ＋
                    </span>
                    <strong>상권 보호 안내 그래픽</strong>
                    <p>확정된 약정 기준으로 제작할 설명용 지도</p>
                  </div>
                  <div className="asset-bottom">
                    <span>1600 × 1200 px</span>
                    <span>조건 확정 후</span>
                  </div>
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
            <div style={{ marginTop: "35px" }}>
              <a className="cta" href="#consult">
                우리 동네 도입 가능 여부 확인<span>↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* 9. PACKAGE */}
        <section className="s-package section white" id="package">
          <div className="wrap center">
            <span className="eyebrow">08 / 도입 전 확인할 것</span>
            <h2>
              마음만 급하게 말고, <br />
              <u>조건까지 확실하게.</u>
            </h2>
            <p className="lead">
              맛과 운영 방식이 마음에 들었다면, <br />내 매장에서 필요한 준비를 확인하세요.
            </p>
            <div className="table">
              <div className="row">
                <span>파이 패키지</span>
                <strong>
                  440만원 <small>VAT 포함</small>
                </strong>
              </div>
              <div className="row">
                <span>포함 구성</span>
                <span>전용 머신 · 초도 원재료 · 매장 홍보물 · 설치 및 조리 교육</span>
              </div>
              <div className="row">
                <span>매장 준비</span>
                <span>작업 공간 · 전원 · 냉동 보관 환경 확인</span>
              </div>
              <div className="row">
                <span>상담 확인</span>
                <span>공급 단가 · 최소 발주 · 배송 조건 · 별도 비용 · 상권 보호 적용 여부</span>
              </div>
            </div>
            <p className="small">
              공식 홈페이지 게시 가격·구성을 반영한 검토용 안내입니다. 적용 기간과 세부 포함 항목은 최종 확인이 필요합니다.
            </p>
            <div className="faq">
              <details>
                <summary>기존 카페를 운영하면서 도입할 수 있나요?</summary>
                <p>
                  기존 매장을 활용하는 샵인샵 모델을 상담할 수 있습니다. 현재 설비와 작업 동선, 보관 환경에 따라 도입 조건이 달라집니다.
                </p>
              </details>
              <details>
                <summary>브랜드 전환도 상담할 수 있나요?</summary>
                <p>
                  원본 브랜드 안내에는 업종 전환 모델도 포함되어 있습니다. 샵인샵과 브랜드 전환은 비용·시설·계약 조건이 다르므로 현재 매장 상황을 기준으로 확인합니다.
                </p>
              </details>
              <details>
                <summary>상담하면 바로 계약해야 하나요?</summary>
                <p>
                  이 페이지는 도입 조건 상담을 제안하는 검토용 시안입니다. 최종 운영 시 상담 절차와 계약 검토 과정을 구체적으로 안내합니다.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* 10. CONSULT */}
        <section className="s-consult consult" id="consult" ref={consultRef}>
          <div className="wrap center">
            <span className="eyebrow">다음 메뉴는 고민 중. 다음 행동은 지금.</span>
            <h2>
              우리 동네 디저트 손님, <br />
              누가 먼저 잡을까요?
            </h2>
            <p className="lead">
              내 매장에 맞는 메뉴부터 도입 조건까지. <br />
              <b>우리 지역에서 시작할 수 있는지 확인하세요.</b>
            </p>
            <form
              className="form"
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

      <footer>
        <div className="wrap footer-row">
          <div className="brand">
            120<span>PIE</span>
          </div>
          <div>
            클라이언트 검토용 · 지역 선점 메시지 중심 상품 상세페이지형 시안 · 운영주체: (주)고우웰라이프 (1566-3594) <br />
            실적·리뷰·상권 보호는 자료 확인 후 확정합니다. 사업 성과를 보장하지 않습니다. <br />
            제품 이미지 및 패키지 안내 출처:{" "}
            <a
              href="https://120piecoffee.com/franchise"
              target="_blank"
              rel="noopener noreferrer"
            >
              120PIE 공식 홈페이지 ↗
            </a>
          </div>
        </div>
      </footer>

      <div
        className={`fixed${fixedHidden ? " is-hidden" : ""}`}
        id="fixed-cta"
      >
        <div className="wrap">
          <strong>
            우리 동네, 내가 먼저.
            <small>(주)고우웰라이프 · 실시간 상담 접수 연동</small>
          </strong>
          <a className="cta" href="#consult">
            우리 지역 도입 가능 여부 확인<span>↗</span>
          </a>
        </div>
      </div>

      <dialog
        ref={guideRef}
        id="image-guide"
        aria-labelledby="guide-title"
        data-editorial="true"
        onClose={updateFixed}
        onClick={handleDialogBackdropClick}
      >
        <div className="guide-top">
          <div>
            <span className="mini">ASSET DIRECTION</span>
            <h2 id="guide-title">이 페이지를 완성할 이미지.</h2>
          </div>
          <button
            type="button"
            className="guide-close"
            aria-label="이미지 가이드 닫기"
            onClick={closeGuide}
          >
            ×
          </button>
        </div>
        <p className="guide-intro">
          첫 화면과 메뉴는 맛을 보여주고, 매장·조리·리뷰는 믿을 근거를 보여줘야 합니다. 이 역할은 글자와 도형만으로 채울 수 없습니다.
        </p>
        <div className="guide-priority">
          <b>먼저 준비할 3가지</b>
          <span>① 메인 단면 사진</span>
          <span>② 메뉴별 제품 사진 3장</span>
          <span>③ 실제 조리 영상</span>
        </div>
        <div className="guide-table">
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>필요한 이미지</th>
                <th>권장 규격</th>
                <th>우선순위</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>01</td>
                <td>
                  <a href="#asset-01" className="guide-jump" onClick={closeGuide}>
                    메인 제품 키비주얼 ↗
                  </a>
                  <small>파이 단면을 크게, 커피와 포장 박스는 보조로</small>
                </td>
                <td>
                  4:5<small>1600 × 2000 px</small>
                </td>
                <td>필수</td>
              </tr>
              <tr>
                <td>02</td>
                <td>
                  <a href="#asset-02" className="guide-jump" onClick={closeGuide}>
                    실제 도입 매장 ↗
                  </a>
                  <small>장비와 작업대가 함께 보이는 실제 매장 사진</small>
                </td>
                <td>
                  4:3<small>1200 × 900 px</small>
                </td>
                <td>필수</td>
              </tr>
              <tr>
                <td>03</td>
                <td>
                  <a href="#asset-03" className="guide-jump" onClick={closeGuide}>
                    실제 운영 장면 ↗
                  </a>
                  <small>점주가 파이를 굽거나 포장하는 장면</small>
                </td>
                <td>
                  4:3<small>1200 × 900 px</small>
                </td>
                <td>권장</td>
              </tr>
              <tr>
                <td>04</td>
                <td>
                  <a href="#asset-04" className="guide-jump" onClick={closeGuide}>
                    실제 판매 자료 ↗
                  </a>
                  <small>매장·기간을 확인할 수 있는 판매 자료</small>
                </td>
                <td>
                  4:3<small>1200 × 900 px</small>
                </td>
                <td>자료 확인</td>
              </tr>
              <tr>
                <td>05</td>
                <td>
                  <a href="#asset-05" className="guide-jump" onClick={closeGuide}>
                    애플파이 ↗
                  </a>
                  <small>페이스트리 결·사과 필링이 보이는 단면</small>
                </td>
                <td>
                  4:5<small>1200 × 1500 px</small>
                </td>
                <td>필수</td>
              </tr>
              <tr>
                <td>06</td>
                <td>
                  <a href="#asset-06" className="guide-jump" onClick={closeGuide}>
                    불고기파이 ↗
                  </a>
                  <small>불고기 필링과 제품 크기가 드러나는 컷</small>
                </td>
                <td>
                  4:5<small>1200 × 1500 px</small>
                </td>
                <td>필수</td>
              </tr>
              <tr>
                <td>07</td>
                <td>
                  <a href="#asset-07" className="guide-jump" onClick={closeGuide}>
                    페페로니 피자파이 ↗
                  </a>
                  <small>치즈와 페페로니가 보이는 제품 단면</small>
                </td>
                <td>
                  4:5<small>1200 × 1500 px</small>
                </td>
                <td>필수</td>
              </tr>
              <tr>
                <td>08</td>
                <td>
                  <a href="#asset-08" className="guide-jump" onClick={closeGuide}>
                    실제 조리 영상 ↗
                  </a>
                  <small>준비 → 굽기 → 포장, 끊김 없이 보여주는 실제 과정</small>
                </td>
                <td>
                  16:9<small>1920 × 1080 px · MP4</small>
                </td>
                <td>필수</td>
              </tr>
              <tr>
                <td>09</td>
                <td>
                  <a href="#asset-09" className="guide-jump" onClick={closeGuide}>
                    실제 구매 고객 리뷰 ↗
                  </a>
                  <small>맛·식감·커피와의 조합이 드러나는 원문</small>
                </td>
                <td>
                  4:3<small>1200 × 900 px</small>
                </td>
                <td>필수</td>
              </tr>
              <tr>
                <td>10</td>
                <td>
                  <a href="#asset-10" className="guide-jump" onClick={closeGuide}>
                    실제 포장·배달 리뷰 ↗
                  </a>
                  <small>포장 상태와 재주문 이유가 드러나는 원문</small>
                </td>
                <td>
                  4:3<small>1200 × 900 px</small>
                </td>
                <td>필수</td>
              </tr>
              <tr>
                <td>11</td>
                <td>
                  <a href="#asset-11" className="guide-jump" onClick={closeGuide}>
                    포장·커피 세트 ↗
                  </a>
                  <small>실제 판매 가능한 구성과 패키지를 함께 촬영</small>
                </td>
                <td>
                  4:5<small>1200 × 1500 px</small>
                </td>
                <td>필수</td>
              </tr>
              <tr>
                <td>12</td>
                <td>
                  <a href="#asset-12" className="guide-jump" onClick={closeGuide}>
                    실제 배달앱 메뉴 화면 ↗
                  </a>
                  <small>운영 중인 매장의 메뉴 화면, 개인정보는 제외</small>
                </td>
                <td>
                  9:16<small>1080 × 1920 px</small>
                </td>
                <td>권장</td>
              </tr>
              <tr>
                <td>13</td>
                <td>
                  <a href="#asset-13" className="guide-jump" onClick={closeGuide}>
                    상권 보호 안내 그래픽 ↗
                  </a>
                  <small>확정된 약정 기준으로 제작할 설명용 지도</small>
                </td>
                <td>
                  4:3<small>1600 × 1200 px</small>
                </td>
                <td>조건 확정 후</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="guide-foot">
          리뷰·판매 자료는 실제 원문을 사용하고, 상권 그래픽은 약정 확정 후 제작하세요. 사진에는 문구를 넣지 않고 여백을 확보하면 모바일에서도 활용하기 좋습니다.
        </p>
        <button
          type="button"
          className="cta guide-close-button"
          onClick={closeGuide}
        >
          화면으로 돌아가기 <span>↗</span>
        </button>
      </dialog>
    </div>
  );
}
