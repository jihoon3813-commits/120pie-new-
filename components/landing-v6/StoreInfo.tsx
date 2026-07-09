"use client";

interface Store {
  name: string;
  address: string;
  img: string;
  phone: string;
  hours: string;
}

export default function StoreInfo() {
  const stores: Store[] = [
    {
      name: "120겹파이 본점",
      address: "서울 성북구 돌곶이로14길 35 1층",
      img: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781185938/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EB%B3%B8%EC%A0%90_%EC%84%9C%EC%9A%B8_%EC%84%B1%EB%B6%81%EA%B5%AC_%EB%8F%8C%EA%B3%B6%EC%9D%B4%EB%A1%9C14%EA%B8%B8_35_1%EC%B8%B5_k9mjon_z90vyq.jpg",
      phone: "02-1234-5678",
      hours: "매일 10:00 - 22:00",
    },
    {
      name: "120겹파이 AK플라자 금정점",
      address: "경기 군포시 엘에스로 143 1층 1001호",
      img: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186013/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_AK%ED%94%8C%EB%9D%BC%EC%9E%90_%EA%B8%88%EC%A0%95%EC%A0%90_%EA%B2%BD%EA%B8%B0_%EA%B5%B0%ED%8F%AC%EC%8B%9C_%EC%97%98%EC%97%90%EC%8A%A4%EB%A1%9C_143_1%EC%B8%B5_1001%ED%98%B8_qcmpgs_bmrkku.jpg",
      phone: "031-850-1234",
      hours: "매일 10:30 - 22:00",
    },
    {
      name: "120겹파이 삼산점",
      address: "인천 부평구 장제로228번길 24",
      img: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781186018/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%82%BC%EC%82%B0%EC%A0%90_%EC%9D%B8%EC%B2%9C_%EB%B6%80%ED%8F%89%EA%B5%AC_%EC%9E%A5%EC%A0%9C%EB%A1%9C228%EB%B2%88%EA%B8%B8_24_o9q4qy_m3wmdr.jpg",
      phone: "032-508-5678",
      hours: "매일 09:00 - 21:00",
    },
  ];

  return (
    <section id="stores" className="py-24 bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-amber-500 tracking-wider uppercase">
            Store Network
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            가까운 120pie 매장을 찾아보세요
          </h2>
          <p className="text-base text-neutral-600 dark:text-neutral-400">
            가장 신선한 120겹 파이를 직접 경험해볼 수 있는 오프라인 매장을 안내해 드립니다.
          </p>
        </div>

        {/* Store Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stores.map((store, index) => (
            <div
              key={index}
              className="bg-white dark:bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              {/* Store Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={store.img}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Store Details */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    {store.name}
                  </h3>
                  <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                    <p className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-amber-500 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {store.address}
                    </p>
                    <p className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-amber-500 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {store.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-amber-500 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {store.hours}
                    </p>
                  </div>
                </div>

                <a
                  href={`https://map.naver.com/v5/search/${encodeURIComponent(store.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-2.5 text-xs font-bold text-neutral-800 dark:text-white border border-neutral-300 dark:border-neutral-800 hover:border-amber-500 dark:hover:border-amber-500 hover:text-amber-500 dark:hover:text-amber-400 rounded-lg transition-colors"
                >
                  네이버 지도에서 보기
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
