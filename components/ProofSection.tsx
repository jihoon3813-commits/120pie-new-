"use client";

import VisualImage from "./VisualImage";

const proofs = [
  ["287개+", "전국 취급점 및 가맹점 운영"],
  ["박람회 현장 검증", "매월 카페 박람회에서 직접 시식 반응 확인"],
  ["미디어/SNS 노출", "유튜버, 방송, 브이로그를 통한 자발적 바이럴"],
  ["기존 카페 도입 사례", "샵인샵 및 업종변경 운영 가능"]
];

export default function ProofSection() {
  return (
    <section className="section soft" id="proof">
      <div className="container">
        <div className="section-heading">
          <h2>이미 현장에서 검증된 메뉴입니다</h2>
        </div>
        <div className="card-grid four">
          {proofs.map(([title, body]) => (
            <article className="metric-card" key={title}>
              <strong>{title}</strong>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className="image-triplet proof-gallery">
          <VisualImage src="/images/proof-expo.jpg" label="박람회 현장 이미지" badge="expo" />
          <VisualImage src="/images/proof-line.jpg" label="줄 서는 장면" badge="tasting" />
          <VisualImage src="/images/proof-consulting.jpg" label="상담 장면" badge="consulting" />
        </div>
        <div className="center-block">
          <p className="strong-copy">말로 설명하는 브랜드가 아니라 현장에서 맛으로 검증된 브랜드입니다.</p>
          <button className="cta" onClick={() => document.querySelector("#consultation")?.scrollIntoView({ behavior: "smooth" })}>
            실제 도입 사례 상담받기
          </button>
        </div>
      </div>
    </section>
  );
}
