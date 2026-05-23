"use client";

import { ComparisonTable } from "./WasteReductionSection";

const rows = [
  ["도입 목적", "메뉴 추가", "매출 구조 개선"],
  ["제조 방식", "완제품/해동 중심", "현장 직접 제조"],
  ["운영 난이도", "관리 부담 있음", "전용 머신 기반"],
  ["폐기 부담", "당일 판매 부담", "냉동 보관 기반"],
  ["차별성", "흔한 메뉴 가능성", "120겹 파이/에그120"],
  ["판매 방식", "홀 판매 중심", "홀/포장/배달 가능"],
  ["기존 카페 적합성", "매장에 따라 제한", "샵인샵 도입 가능"]
];

export default function ComparisonSection() {
  return (
    <section className="section" id="comparison">
      <div className="container">
        <div className="section-heading">
          <h2>일반 디저트 도입과 무엇이 다를까요?</h2>
        </div>
        <ComparisonTable headers={["비교 항목", "일반 디저트 도입", "120pie&coffee"]} rows={rows} />
        <div className="center-block">
          <p className="strong-copy">디저트를 추가하는 게 아니라 매출 구조를 추가하는 겁니다.</p>
          <button className="cta" onClick={() => document.querySelector("#consultation")?.scrollIntoView({ behavior: "smooth" })}>
            다른 디저트와 비교 상담하기
          </button>
        </div>
      </div>
    </section>
  );
}
