"use client";

const before = ["음료 중심 매장", "객단가 낮음", "디저트 매출 약함", "배달앱 차별화 부족"];
const after = ["음료 + 디저트 세트 판매", "객단가 상승", "시그니처 메뉴 확보", "포장/배달 매출 강화"];
const stores = ["개인카페", "저가커피 매장", "소형 카페", "배달형 카페", "브런치 카페", "휴게음식점"];

export default function ShopInShopSection() {
  return (
    <section className="section" id="shop-in-shop">
      <div className="container">
        <div className="section-heading">
          <h2>간판을 바꾸지 않아도 시작할 수 있습니다</h2>
          <p>지금 운영 중인 카페에 120겹 파이와 에그120을 추가해 디저트 매출을 만드는 방식입니다.</p>
        </div>
        <div className="compare-panels">
          <CompareBox title="Before" items={before} />
          <CompareBox title="After" items={after} highlight />
        </div>
        <div className="store-types">
          {stores.map((store) => (
            <span key={store}>{store}</span>
          ))}
        </div>
        <div className="center-block">
          <p className="strong-copy">카페는 그대로, 팔리는 메뉴만 추가하세요.</p>
          <button className="cta" onClick={() => document.querySelector("#consultation")?.scrollIntoView({ behavior: "smooth" })}>
            우리 매장도 가능한지 확인하기
          </button>
        </div>
      </div>
    </section>
  );
}

function CompareBox({ title, items, highlight = false }: { title: string; items: string[]; highlight?: boolean }) {
  return (
    <article className={`compare-box ${highlight ? "highlight" : ""}`}>
      <h3>{title}</h3>
      {items.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </article>
  );
}
