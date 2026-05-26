"use client";

const items = [
  {
    label: "매출 한계",
    copy: "음료 객단가가 낮아 매출 한계가 느껴진다",
    metric: "낮은 객단가",
    tone: "orange"
  },
  {
    label: "폐기 부담",
    copy: "디저트를 팔고 싶지만 폐기가 부담스럽다",
    metric: "재고 리스크",
    tone: "gold"
  },
  {
    label: "관리 난도",
    copy: "케이크나 베이커리는 관리가 어렵다",
    metric: "운영 피로",
    tone: "brown"
  },
  {
    label: "마진 압박",
    copy: "저가커피 경쟁 때문에 마진이 줄었다",
    metric: "수익성 저하",
    tone: "orange"
  },
  {
    label: "메뉴 부재",
    copy: "배달앱에서 눈에 띄는 메뉴가 없다",
    metric: "차별화 부족",
    tone: "gold"
  },
  {
    label: "시그니처",
    copy: "손님이 사진 찍을 만한 시그니처 메뉴가 필요하다",
    metric: "방문 이유",
    tone: "brown"
  }
];

export default function ProblemSection() {
  return (
    <section className="section soft" id="problems">
      <div className="container">
        <div className="section-heading problem-heading">
          <span className="eyebrow">카페 운영 체크포인트</span>
          <h2>지금 카페 사장님들이 가장 많이 하는 고민</h2>
          <p>음료만으로는 매출을 올리기 어렵고, 디저트는 하고 싶지만 운영 부담이 걱정됩니다.</p>
        </div>
        <div className="problem-panel" aria-label="카페 운영 고민 요약">
          <div>
            <span>6가지</span>
            <strong>반복되는 운영 고민</strong>
          </div>
          <div className="problem-flow">
            <span>객단가</span>
            <i />
            <span>폐기</span>
            <i />
            <span>관리</span>
            <i />
            <span>차별화</span>
          </div>
        </div>
        <div className="problem-grid">
          {items.map((item, index) => (
            <article className={`problem-card ${item.tone}`} key={item.copy}>
              <div className="problem-card-top">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <b>{item.label}</b>
              </div>
              <p>{item.copy}</p>
              <strong>{item.metric}</strong>
            </article>
          ))}
        </div>
        <div className="center-block problem-result">
          <span>결론</span>
          <p className="strong-copy">그래서 필요한 건 단순한 디저트가 아니라, 카페 운영에 맞는 수익형 디저트 시스템입니다.</p>
          <button className="cta" onClick={() => document.querySelector("#consultation")?.scrollIntoView({ behavior: "smooth" })}>
            우리 매장에도 맞는지 확인하기
          </button>
        </div>
      </div>
    </section>
  );
}
