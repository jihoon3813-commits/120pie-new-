"use client";

export default function Footer() {
  const go = (target: string) => document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h2>120pie&coffee</h2>
          <p>카페 사장님을 위한 디저트 매출 솔루션</p>
          <button className="cta small" onClick={() => go("#consultation")}>
            가맹 상담 신청하기
          </button>
        </div>
        <nav>
          {[
            ["브랜드 소개", "#hero"],
            ["메뉴", "#menu"],
            ["가맹 문의", "#consultation"],
            ["박람회 예약", "#expo"],
            ["개인정보처리방침", "#consultation"]
          ].map(([label, href]) => (
            <button key={label} onClick={() => go(href)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="business-info">
          <p>회사명: 추후 입력</p>
          <p>대표자: 추후 입력</p>
          <p>사업자등록번호: 추후 입력</p>
          <p>주소: 추후 입력</p>
          <p>대표번호: 추후 입력</p>
          <p>이메일: 추후 입력</p>
        </div>
      </div>
    </footer>
  );
}
