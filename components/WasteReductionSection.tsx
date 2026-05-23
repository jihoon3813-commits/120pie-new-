"use client";

const rows = [
  ["보관", "당일 판매 부담", "냉동 보관"],
  ["제조", "미리 준비 필요", "주문 후 조리"],
  ["폐기", "재고 예측 실패 시 부담", "필요한 만큼 사용"],
  ["관리", "쇼케이스/선도 관리", "원재료 중심 관리"],
  ["운영", "숙련도 필요", "전용 시스템 기반"]
];

export default function WasteReductionSection() {
  return (
    <section className="section warm" id="waste">
      <div className="container">
        <div className="section-heading">
          <h2>디저트는 팔고 싶지만, 폐기가 걱정된다면</h2>
          <p>일반 케이크나 생물 디저트와 달리 120pie는 주문 후 조리하는 운영 구조로 재고 부담을 줄일 수 있습니다.</p>
        </div>
        <ComparisonTable headers={["구분", "일반 디저트", "120pie&coffee"]} rows={rows} />
        <div className="center-block">
          <p className="strong-copy">많이 만들어놓고 기다리지 않습니다. 주문 들어오면 바로 굽습니다.</p>
          <button className="cta" onClick={() => document.querySelector("#consultation")?.scrollIntoView({ behavior: "smooth" })}>
            폐기 부담 낮은 도입 방식 알아보기
          </button>
        </div>
      </div>
    </section>
  );
}

export function ComparisonTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("-")}>
              {row.map((cell, index) => (
                <td className={index === row.length - 1 ? "accent-cell" : ""} key={cell}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
