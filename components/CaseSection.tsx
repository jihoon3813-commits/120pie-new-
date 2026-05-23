"use client";

const cases = [
  ["CASE 1. 개인카페", "디저트 매출이 약한 개인카페", "기존 음료 메뉴는 유지하고 120겹 파이를 세트 메뉴로 구성합니다.", "개인카페 도입 상담"],
  ["CASE 2. 저가커피 매장", "객단가가 낮은 저가커피 매장", "커피 한 잔 주문을 커피 + 파이 주문으로 바꿉니다.", "저가커피 매장 상담"],
  ["CASE 3. 배달형 카페", "배달앱에서 차별화가 필요한 매장", "파이와 에그120을 활용해 포장/배달 전용 세트 메뉴를 구성합니다.", "배달형 매장 상담"],
  ["CASE 4. 예비 창업자", "소자본으로 디저트 창업을 원하는 분", "복잡한 제빵 기술보다 운영 시스템 중심으로 시작할 수 있습니다.", "소자본 창업 상담"]
];

export default function CaseSection() {
  return (
    <section className="section" id="cases">
      <div className="container">
        <div className="section-heading">
          <h2>매장 유형별로 이렇게 도입할 수 있습니다</h2>
        </div>
        <div className="card-grid four">
          {cases.map(([title, lead, body, cta]) => (
            <article className="info-card" key={title}>
              <h3>{title}</h3>
              <strong>{lead}</strong>
              <p>{body}</p>
              <button className="text-cta" onClick={() => document.querySelector("#consultation")?.scrollIntoView({ behavior: "smooth" })}>
                {cta}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
