"use client";

export default function BrandStory() {
  const stories = [
    {
      title: "120겹의 프리미엄 페이스트리",
      description:
        "기계로 흉내 낼 수 없는 섬세한 공정으로 120겹을 완성합니다. 한 입 베어 물 때 느껴지는 가볍고 바삭한 식감과 깊은 버터의 풍미를 느껴보세요.",
      image: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781183595/120%ED%8C%8C%EC%9D%B4_%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88_%EC%95%A0%ED%94%8C_%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC_%EC%97%B0%EC%B6%9C_bzyzzs.jpg",
      tag: "Craftmanship",
    },
    {
      title: "파이와 조화를 이루는 스페셜티 커피",
      description:
        "120겹 파이의 바삭함과 단맛을 가장 잘 받쳐주도록 블렌딩된 프리미엄 스페셜티 원두. 바리스타의 정성으로 내린 깊은 향과 부드러운 산미의 조화를 경험할 수 있습니다.",
      image: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781185663/%EC%98%88%EC%81%9C_%EC%B9%B4%ED%8E%98_%ED%85%8C%EC%9D%B4%EB%B8%94_%EC%9C%84%EC%97%90_%EC%9C%84_202605271143_npntmg_cbmmh0.jpg",
      tag: "Specialty Coffee",
    },
    {
      title: "당일 생산 & 당일 판매의 신선함",
      description:
        "최상의 바삭함을 유지하기 위해 매일 매장에서 갓 구워낸 파이만을 제공합니다. 언제 방문하셔도 한결같은 품질과 따뜻한 신선함을 선사합니다.",
      image: "https://res.cloudinary.com/dfarfqx7e/image/upload/f_auto,q_auto/v1781183720/120%ED%8C%8C%EC%9D%B4_%EC%97%B0%EC%B6%9C4_yszrts.jpg",
      tag: "Fresh Baked",
    },
  ];

  return (
    <section id="story" className="py-24 bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold text-amber-500 tracking-wider uppercase">
            Our Identity
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            비교할 수 없는 120겹의 차이
          </h2>
          <p className="text-base text-neutral-600 dark:text-neutral-400">
            단순히 파이와 커피를 파는 공간을 넘어, 일상 속 작은 미식의 행복을 선사하기 위해 120pie는 끊임없이 정성을 다합니다.
          </p>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-200/60 dark:border-neutral-800/60 hover:shadow-xl dark:hover:shadow-neutral-900/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-neutral-950/20 group-hover:opacity-40 transition-opacity duration-300" />
                <span className="absolute top-4 left-4 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500 text-white shadow-sm">
                  {story.tag}
                </span>
              </div>

              {/* Content */}
              <div className="p-8 space-y-3">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                  {story.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {story.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
