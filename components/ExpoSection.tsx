"use client";

import VisualImage from "./VisualImage";

export default function ExpoSection() {
  return (
    <section className="section expo" id="expo">
      <div className="container expo-grid">
        <div>
          <p className="eyebrow">박람회 시식 예약</p>
          <h2>직접 맛보고 결정하세요</h2>
          <p className="section-copy">
            120pie&coffee는 카페 박람회 현장에서 예비 점주와 카페 사장님을 직접 만나고 있습니다.
          </p>
          <p className="strong-copy">홈페이지에서 보고, 박람회에서 맛보고, 내 매장 도입 여부를 판단하세요.</p>
        </div>
        <article className="expo-card">
          <h3>다가오는 박람회</h3>
          <dl>
            <div><dt>일정</dt><dd>추후 업데이트 예정</dd></div>
            <div><dt>장소</dt><dd>추후 업데이트 예정</dd></div>
            <div><dt>부스</dt><dd>추후 업데이트 예정</dd></div>
            <div><dt>시식 가능 메뉴</dt><dd>120겹 파이, 에그120</dd></div>
            <div><dt>상담 가능 시간</dt><dd>예약 후 개별 안내</dd></div>
          </dl>
          <p className="notice">예약 후 방문하시면 제품 시식과 도입 상담을 함께 안내드립니다.</p>
          <div className="cta-row">
            <button className="cta" onClick={() => document.querySelector("#consultation")?.scrollIntoView({ behavior: "smooth" })}>
              박람회 시식 예약하기
            </button>
            <button className="cta ghost" onClick={() => document.querySelector("#consultation")?.scrollIntoView({ behavior: "smooth" })}>
              현장 상담 예약하기
            </button>
          </div>
        </article>
        <div className="expo-visuals">
          <VisualImage src="/images/expo-tasting.jpg" label="박람회 시식 장면" badge="tasting zone" />
          <VisualImage src="/images/expo-booth.jpg" label="박람회 부스 상담 장면" badge="booth consult" />
        </div>
      </div>
    </section>
  );
}
