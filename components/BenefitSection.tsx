const benefits = [
  ["객단가 상승", "음료 한 잔에 파이 하나를 더합니다.", "커피와 함께 판매하기 좋은 메뉴로 주문 금액을 자연스럽게 높입니다."],
  ["샵인샵 가능", "간판을 바꾸지 않아도 시작할 수 있습니다.", "기존 카페 공간에 메뉴를 추가하는 방식으로 부담 없이 도입할 수 있습니다."],
  ["초간편 조리", "전문 베이킹 기술이 필요 없습니다.", "전용 머신을 활용해 누구나 쉽게 제조할 수 있는 구조입니다."],
  ["폐기 부담 감소", "팔릴 때 꺼내 굽는 구조입니다.", "냉동 보관 원재료 기반으로 일반 생물 디저트 대비 재고 부담을 줄입니다."],
  ["시그니처 메뉴 확보", "사진 찍히는 메뉴가 매장을 기억하게 합니다.", "120겹 파이와 에그120의 비주얼은 SNS와 배달앱에서 눈에 띄는 무기가 됩니다."]
];

export default function BenefitSection() {
  return (
    <section className="section" id="benefits">
      <div className="container">
        <div className="section-heading">
          <h2>120pie&coffee를 도입하면 달라지는 5가지</h2>
        </div>
        <div className="card-grid three">
          {benefits.map(([title, lead, body]) => (
            <article className="info-card" key={title}>
              <h3>{title}</h3>
              <strong>{lead}</strong>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <p className="bottom-copy">지금 필요한 건 새로운 인테리어가 아니라 매출을 올릴 수 있는 메뉴 구조입니다.</p>
      </div>
    </section>
  );
}
