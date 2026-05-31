"use client";

const steps = [
  ["STEP 1. 원재료 준비", "본사 공급 원재료를 냉동 보관 후 주문 시 사용합니다."],
  ["STEP 2. 전용 머신 조리", "복잡한 기술 없이 정해진 방식으로 제조합니다."],
  ["STEP 3. 3분 내외 완성", "주문 후 빠르게 제공해 피크타임 대응이 가능합니다."]
];
const advantages = ["전문 제빵사 불필요", "초보자 교육 가능", "피크타임 대응", "배달 주문 대응", "1인 운영 부담 감소"];

export default function OperationSection() {
  return (
    <section className="section" id="operation">
      <div className="container">
        <div className="section-heading">
          <h2>베이킹 경험이 없어도 운영 가능합니다</h2>
          <p>전용 원재료와 전용 머신 기반으로 복잡한 제빵 기술 없이 조리할 수 있습니다.</p>
        </div>
        <div className="card-grid three">
          {steps.map(([title, body]) => (
            <article className="step-card" key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className="store-types">
          {advantages.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="center-block">
          <p className="strong-copy">기술로 굽는 디저트가 아니라 시스템으로 굽는 디저트입니다.</p>
          <button className="cta" onClick={() => document.querySelector("#consultation")?.scrollIntoView({ behavior: "smooth" })}>
            실제 조리 방식 상담받기
          </button>
        </div>
      </div>
    </section>
  );
}
