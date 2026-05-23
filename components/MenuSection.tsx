"use client";

import { useState } from "react";
import VisualImage from "./VisualImage";

const menus = [
  {
    title: "120겹 파이",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=82",
    description: "겹겹이 바삭한 패스츄리와 다양한 속재료로 커피와 함께 판매하기 좋은 객단가 상승 메뉴입니다.",
    points: ["커피 세트 판매 적합", "테이크아웃 적합", "배달 메뉴 구성 가능", "오후 간식 수요 대응", "시즌 메뉴 확장 가능"],
    copy: "커피 한 잔으로 끝나는 주문을 파이 세트 주문으로 바꿉니다."
  },
  {
    title: "에그120",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1000&q=82",
    description: "추억의 계란빵을 현대적으로 재해석한 귀엽고 든든한 뉴트로 디저트입니다.",
    points: ["간식 수요", "식사 대용", "아이 동반 고객", "배달/포장", "SNS 비주얼"],
    copy: "디저트와 간식, 식사대용 수요까지 한 번에 잡는 메뉴입니다."
  },
  {
    title: "시즌 메뉴",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1000&q=82",
    description: "계절과 상권에 맞춘 메뉴 확장으로 재방문과 추가 주문을 유도할 수 있습니다.",
    points: ["한정 메뉴 운영", "박람회 반응 테스트", "상권별 구성", "세트 메뉴 확장", "프로모션 활용"],
    copy: "상권과 시즌에 맞춰 팔리는 이유를 계속 만들 수 있습니다."
  }
];

export default function MenuSection() {
  const [active, setActive] = useState(0);
  const menu = menus[active];

  return (
    <section className="section soft" id="menu">
      <div className="container">
        <div className="section-heading">
          <h2>손님이 보고, 찍고, 추가 주문하는 메뉴</h2>
          <p>120겹 파이와 에그120은 맛, 비주얼, 판매 활용도까지 고려한 카페 전용 디저트 메뉴입니다.</p>
        </div>
        <div className="tabs" role="tablist">
          {menus.map((item, index) => (
            <button className={active === index ? "active" : ""} key={item.title} onClick={() => setActive(index)}>
              {item.title}
            </button>
          ))}
        </div>
        <article className="menu-card">
          <VisualImage src={menu.image} label={`${menu.title} 이미지`} className="menu-image float-soft" badge="menu visual" />
          <div>
            <h3>{menu.title}</h3>
            <p>{menu.description}</p>
            <ul className="point-list">
              {menu.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <strong>{menu.copy}</strong>
          </div>
        </article>
      </div>
    </section>
  );
}
