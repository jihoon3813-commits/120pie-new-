"use client";

const items = [
  "음료 객단가가 낮아 매출 한계가 느껴진다",
  "디저트를 팔고 싶지만 폐기가 부담스럽다",
  "케이크나 베이커리는 관리가 어렵다",
  "저가커피 경쟁 때문에 마진이 줄었다",
  "배달앱에서 눈에 띄는 메뉴가 없다",
  "손님이 사진 찍을 만한 시그니처 메뉴가 필요하다"
];

export default function ProblemSection() {
  return (
    <section className="section soft" id="problems">
      <div className="container">
        <div className="section-heading">
          <h2>지금 카페 사장님들이 가장 많이 하는 고민</h2>
          <p>음료만으로는 매출을 올리기 어렵고, 디저트는 하고 싶지만 운영 부담이 걱정됩니다.</p>
        </div>
        <div className="card-grid three">
          {items.map((item, index) => (
            <article className="check-card" key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
        <div className="center-block">
          <p className="strong-copy">그래서 필요한 건 단순한 디저트가 아니라, 카페 운영에 맞는 수익형 디저트 시스템입니다.</p>
          <button className="cta" onClick={() => document.querySelector("#consultation")?.scrollIntoView({ behavior: "smooth" })}>
            우리 매장에도 맞는지 확인하기
          </button>
        </div>
      </div>
    </section>
  );
}
