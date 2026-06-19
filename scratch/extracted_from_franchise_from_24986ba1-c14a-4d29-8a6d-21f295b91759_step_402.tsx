"        {/* SECTION 13. 창업모델 C */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">13 / FRANCHISE MODEL C</span>
            <span className="text-xs font-black text-slate-400">PREMIUM CAFE & BRUNCH</span>
          </div>

          <div className="my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 space-y-4 text-left flex flex-col justify-between">
              <div>
                <span className={`text-xs font-black px-2.5 py-1 ${isPink ? "bg-rose-500/10 text-rose-455 border-rose-500/20" : "bg-amber-400/10 text-amber-600 border-amber-400/20"} border rounded-full`}>
                  모델 C: 15평 이상 프리미엄 카페
                </span>
                <h2 className={`text-xl sm:text-2xl md:text-3xl font-black leading-tight ${textTitle} mt-3`}>
                  브런치 라인업 강화,<br />
                  <span className={textHighlight}>고객 체류 시간</span>을 늘리는 프리미엄형
                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${textDesc} mt-2`}>
                  넓은 홀 테이블을 통해 디저트뿐만 아니라 음료, 브런치 매출의 동반 성장을 이끄는 고수익 플래그십 매장입니다.
                </p>
              </div>
              
              <div className={`grid grid-cols-2 gap-3 text-xs font-bold ${textDesc}`}>
                {[
                  "단독 테이블 홀 좌석 확보",
                  "플레이팅 디저트 세트 공급",
                  "단체 세미나 및 주부 고객 유치",
                  "매장 랜드마크화 디자인"
                ].map((txt, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
   
<truncated 3147 bytes>