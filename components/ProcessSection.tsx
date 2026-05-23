"use client";

const steps = [
  ["STEP 1. 상담 신청", "매장 운영 여부와 지역을 남겨주세요."],
  ["STEP 2. 매장 유형 확인", "기존 카페, 저가커피, 배달형 매장 등 운영 형태를 확인합니다."],
  ["STEP 3. 수익 구조 상담", "예상 판매량, 메뉴 구성, 도입 방식을 함께 계산합니다."],
  ["STEP 4. 계약 및 교육", "운영 방식과 조리 교육을 진행합니다."],
  ["STEP 5. 원재료/장비 세팅", "판매에 필요한 원재료와 장비를 준비합니다."],
  ["STEP 6. 판매 시작", "홀, 포장, 배달 판매를 시작합니다."]
];

export default function ProcessSection() {
  return (
    <section className="section soft" id="process">
      <div className="container">
        <div className="section-heading">
          <h2>도입 절차는 간단합니다</h2>
        </div>
        <div className="timeline">
          {steps.map(([title, body]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className="center-block">
          <button className="cta" onClick={() => document.querySelector("#consultation")?.scrollIntoView({ behavior: "smooth" })}>
            도입 가능 여부 확인하기
          </button>
        </div>
      </div>
    </section>
  );
}
