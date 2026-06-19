                    <span className={`text-xs sm:text-sm font-black ${isPink ? "text-white" : "text-[#0d233a]"}`}>1,050만 원</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-neutral-200/20 pt-6 mt-8 text-[11px] sm:text-xs font-bold text-slate-500">
            <span>* 본사 예상 손익 시뮬레이션 데이터 기준</span>
            <span>Slide 10 / 16</span>
          </div>
        </section>

        {/* SECTION 11. 창업 패키지 세부 비용 */}
        <section className={`rounded-3xl p-6 sm:p-12 ${cardBg} relative`}>
          <div className="flex items-center justify-between border-b border-neutral-200/20 pb-4 mb-8">
            <span className="text-xs font-black tracking-widest text-[#ffd500]">11 / ALL-IN-ONE PACKAGE</span>
            <span className="text-xs font-black text-slate-400">START UP SUPPORT PACKAGES</span>
          </div>

          <div className="space-y-8">
            {/* Header Area */}
            <div className="text-center md:text-left space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black">
                가성비 높은 창업의 시작, <span className={textHighlight}>창업 패키지 구성</span>
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${textDesc}`}>
                기존 운영 중인 매장에 바로 도입할 수 있는 샵인샵 특화 패키지를 합리적인 가격으로 제안합니다.
              </p>
            </div>

            {/* Tables Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
              {/* 올인원 패키지 */}