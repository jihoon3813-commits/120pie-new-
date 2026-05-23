"use client";

import { useMemo, useState } from "react";

const countOptions = [10, 20, 30, 40];
const priceOptions = [4000, 4500, 5000];
const dayOptions = [22, 26, 30];

const won = (value: number) => `${new Intl.NumberFormat("ko-KR").format(value)}원`;

export default function ProfitCalculator() {
  const [dailySalesCount, setDailySalesCount] = useState(20);
  const [averagePrice, setAveragePrice] = useState(4500);
  const [businessDays, setBusinessDays] = useState(26);

  const monthlyCount = useMemo(() => dailySalesCount * businessDays, [dailySalesCount, businessDays]);
  const monthlyRevenue = useMemo(
    () => dailySalesCount * averagePrice * businessDays,
    [dailySalesCount, averagePrice, businessDays]
  );

  return (
    <section className="section warm" id="profit-calculator">
      <div className="container calc-grid">
        <div>
          <p className="eyebrow">수익성 시뮬레이션</p>
          <h2>하루 몇 개만 팔아도 추가매출이 보입니다</h2>
          <p className="section-copy">
            사장님 매장 기준으로 하루 판매량과 판매가를 입력하면 예상 월 매출을 바로 확인할 수 있습니다.
          </p>
        </div>
        <div className="calculator-card">
          <CalcField
            label="하루 예상 판매 수량"
            suffix="개"
            value={dailySalesCount}
            options={countOptions}
            onChange={setDailySalesCount}
          />
          <CalcField
            label="평균 판매가"
            suffix="원"
            value={averagePrice}
            options={priceOptions}
            onChange={setAveragePrice}
          />
          <CalcField
            label="월 영업일"
            suffix="일"
            value={businessDays}
            options={dayOptions}
            onChange={setBusinessDays}
          />
          <div className="result-grid">
            <div>
              <span>월 예상 판매수량</span>
              <strong>{monthlyCount.toLocaleString("ko-KR")}개</strong>
            </div>
            <div>
              <span>월 예상 매출</span>
              <strong>{won(monthlyRevenue)}</strong>
            </div>
            <div className="profit-note">
              <span>예상 매출이익</span>
              <strong>상담 시 매장 기준으로 계산해드립니다</strong>
            </div>
          </div>
          <p className="notice">
            실제 수익은 판매가, 원가, 매장 운영 방식에 따라 달라질 수 있습니다. 상담 시 매장 상황에 맞춰
            구체적으로 계산해드립니다.
          </p>
          <button className="cta full" onClick={() => document.querySelector("#consultation")?.scrollIntoView({ behavior: "smooth" })}>
            내 매장 기준 수익 상담받기
          </button>
        </div>
      </div>
    </section>
  );
}

function CalcField({
  label,
  suffix,
  value,
  options,
  onChange
}: {
  label: string;
  suffix: string;
  value: number;
  options: number[];
  onChange: (value: number) => void;
}) {
  return (
    <div className="calc-field">
      <label>{label}</label>
      <div className="option-row">
        {options.map((option) => (
          <button
            className={value === option ? "selected" : ""}
            key={option}
            onClick={() => onChange(option)}
            type="button"
          >
            {option.toLocaleString("ko-KR")}
            {suffix}
          </button>
        ))}
      </div>
      <div className="input-wrap">
        <input
          inputMode="numeric"
          min="0"
          type="number"
          value={value}
          onChange={(event) => onChange(Math.max(0, Number(event.target.value)))}
        />
        <span>{suffix}</span>
      </div>
    </div>
  );
}
