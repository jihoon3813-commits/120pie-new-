"        {/* SECTION 11. 창업모델 A */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">11 / FRANCHISE MODEL A</span>
            <span className="text-xs font-black text-slate-400">SHOP-IN-SHOP / DELIVERY</span>
          </div>

          <div className="my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 space-y-4 text-left flex flex-col justify-between">
              <div>
                <span className={`text-xs font-black px-2.5 py-1 ${isPink ? "bg-rose-500/10 text-rose-455 border-rose-500/20" : "bg-amber-400/10 text-amber-600 border-amber-400/20"} border rounded-full`}>
                  모델 A: 샵인샵 / 배달 전문형
                </span>
                <h2 className={`text-xl sm:text-2xl md:text-3xl font-black leading-tight ${textTitle} mt-3`}>
                  기존 매장 그대로,<br />
                  <span className={textHighlight}>440만 원</span> 소자본 즉시 결합
                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${textDesc} mt-2`}>
                  기존 카페, 핫도그, 떡볶이집 매장에 기기 세팅과 사인물 교체만으로 디저트 판매를 시작하는 초간편 하이브리드 가입 프로그램입니다.
                </p>
              </div>
              
              <div className={`grid grid-cols-2 gap-3 text-xs font-bold ${textDesc}`}>
                {[
                  "가맹비/교육비 파격 환급",
                  "주방 설비 공사 불필요",
                  "초도 생지 200개 지원",
                  "배달 플랫폼 즉시 연동"
                ].map((txt, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                 
<truncated 13020 bytes>