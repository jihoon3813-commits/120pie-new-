"use client";

import VisualImage from "./VisualImage";

const badges = ["샵인샵 가능", "5분 내외 조리", "냉동보관", "객단가 상승", "박람회 검증", "전국 운영 경험"];

const scrollToTarget = (target: string) =>
  document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });

export default function HeroSection() {
  return (
    <section className="hero section" id="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">기존 카페 사장님을 위한 디저트 매출 솔루션</p>
          <h1>디저트 추가매출을 만드세요</h1>
          <p className="lead">
            120겹 파이와 에그120은 기존 카페에 바로 도입 가능한 샵인샵 디저트 아이템입니다.
            초간편 조리, 낮은 폐기 부담, 높은 객단가로 카페의 매출 구조를 바꿉니다.
          </p>
          <div className="badge-row">
            {badges.map((badge) => (
              <span className="badge" key={badge}>
                {badge}
              </span>
            ))}
          </div>
          <div className="cta-row">
            <button className="cta" onClick={() => scrollToTarget("#consultation")}>
              내 매장 도입 가능성 확인하기
            </button>
            <button className="cta ghost" onClick={() => scrollToTarget("#expo")}>
              박람회 시식 예약하기
            </button>
          </div>
          <div className="hero-stats" aria-label="도입 핵심 지표">
            <div>
              <strong>5분</strong>
              <span>내외 제조</span>
            </div>
            <div>
              <strong>287+</strong>
              <span>취급점 경험</span>
            </div>
            <div>
              <strong>3way</strong>
              <span>홀·포장·배달</span>
            </div>
          </div>
        </div>
        <div className="hero-visual" aria-label="제품 이미지 영역">
          <VisualImage
            src="/images/hero-pie.jpg"
            label="120겹 파이 굽는 장면"
            className="main-image float-slow"
            badge="120 layered pie"
          />
          <div className="visual-stack">
            <VisualImage src="/images/cheese-pull.jpg" label="치즈 늘어나는 장면" badge="fresh baked" />
            <VisualImage src="/images/egg120.jpg" label="에그120 이미지" badge="egg120" />
          </div>
          <div className="motion-rail" aria-hidden="true">
            <span>SHOP-IN-SHOP · 5MIN COOKING · LOW WASTE · SET MENU · DELIVERY ·</span>
          </div>
        </div>
      </div>
    </section>
  );
}
