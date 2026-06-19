"          <div className="space-y-6">
            {/* Top Grid: Title and Support Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left Title */}
              <div className="text-center md:text-left space-y-2">
                <span className={`text-xs font-black tracking-widest ${isPink ? "text-rose-450" : "text-amber-500"} uppercase block font-mono`}>Franchise Process</span>
                <h2 className="text-3xl sm:text-4xl font-black">
                  체계적인 <span className={textHighlight}>창업 절차</span>
                </h2>
                <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                  계약부터 오픈 이후 사후관리까지, 본사의 밀착 케어 시스템으로 안정적인 창업을 지원합니다.
                </p>
              </div>

              {/* Right Support Points Card */}
              <div className={`p-4 sm:p-5 rounded-3xl border ${isPink ? "bg-neutral-900/60 border-neutral-800 shadow-rose-950/5" : "bg-white border-amber-200/50 shadow-amber-100/10"} shadow-lg text-left`}>
                <h3 className={`text-xs sm:text-sm font-black text-center mb-3 ${textTitle}`}>본사 지원 포인트</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { title: "상권 분석", icon: <MapPin size={18} className={isPink ? "text-rose-400" : "text-amber-600"} />, bgClass: isPink ? "bg-neutral-950 border border-neutral-850" : "bg-[#fffbf4] border border-amber-200/40" },
                    { title: "메뉴 교육", icon: <ChefHat size={18} className={isPink ? "text-rose-400" : "text-amber-600"} />, bgClass: isPink ? "bg-neutral-950 border border-neutral-850" : "bg-[#fffbf4] border border-amber-200/40" },
                    { title: "오픈 세팅", icon: <Store size={18} className={isPink ? "text-rose-400" : "text-amber-600"} />, bgClass: isPink ? "bg-neutral-950 
<truncated 4833 bytes>