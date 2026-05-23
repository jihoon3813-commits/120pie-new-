"use client";

const supports = ["가맹비 지원", "교육비 지원", "로열티 부담 완화", "보증금 부담 완화", "배달앱 세팅 지원", "1:1 운영 지원"];

export default function SupportSection() {
  return (
    <section className="section" id="support">
      <div className="container">
        <div className="section-heading">
          <h2>초기 부담을 낮춘 도입 구조</h2>
          <p>기존 카페 사장님과 예비 창업자가 부담을 줄이고 시작할 수 있도록 도입 구조와 운영 지원을 함께 안내합니다.</p>
        </div>
        <div className="card-grid three">
          {supports.map((item) => (
            <article className="check-card" key={item}>
              <span>지원</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
        <div className="center-block">
          <p className="notice">매장 형태와 도입 범위에 따라 세부 조건은 달라질 수 있습니다.</p>
          <button className="cta" onClick={() => document.querySelector("#consultation")?.scrollIntoView({ behavior: "smooth" })}>
            내 매장 기준 창업비용 확인하기
          </button>
        </div>
      </div>
    </section>
  );
}
