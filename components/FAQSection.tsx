"use client";

import { useState } from "react";

const faqs = [
  ["기존 카페에도 도입 가능한가요?", "네. 기존 카페에 샵인샵 형태로 도입할 수 있습니다. 간판을 바꾸지 않고 메뉴 추가 방식으로 상담 가능합니다."],
  ["베이킹을 못해도 가능한가요?", "가능합니다. 전용 원재료와 전용 머신 기반으로 운영하기 때문에 전문 제빵 기술이 없어도 교육 후 운영할 수 있습니다."],
  ["폐기 부담은 어느 정도인가요?", "냉동 보관 원재료를 주문 후 조리하는 방식이라 일반 생물 디저트 대비 폐기 부담을 줄일 수 있습니다."],
  ["저가커피 매장에도 맞나요?", "맞습니다. 저가커피 매장은 객단가 상승이 중요하기 때문에 커피와 함께 판매할 디저트 메뉴가 필요합니다."],
  ["배달 판매도 가능한가요?", "가능합니다. 매장 상황에 따라 홀, 포장, 배달 메뉴로 구성할 수 있습니다."],
  ["창업비용은 얼마인가요?", "매장 형태, 도입 범위, 장비 구성에 따라 달라집니다. 상담 시 사장님 매장 기준으로 안내드립니다."],
  ["상권 보호가 되나요?", "가맹점 간 근접 출점으로 인한 경쟁을 줄이기 위해 상권 보호 기준을 상담 시 안내드립니다."]
];

export default function FAQSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section warm" id="faq">
      <div className="container narrow">
        <div className="section-heading">
          <h2>사장님들이 가장 많이 묻는 질문</h2>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <article className="faq-item" key={question}>
              <button onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}>
                <span>Q. {question}</span>
                <b>{open === index ? "-" : "+"}</b>
              </button>
              {open === index ? <p>A. {answer}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
