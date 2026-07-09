"use client";

import { Play } from "lucide-react";

export default function YouTubeVideoSection() {
  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-neutral-950 transition-colors duration-300 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Play Badge */}
        <div className="inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-black mb-4 font-mono shadow-sm">
          <Play className="w-3 h-3 fill-current" />
          <span>BRAND VIDEO</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight mb-4">
          맛있는 120겹 파이가 구워지는 과정
        </h2>
        <p className="text-xs sm:text-sm font-bold text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
          바삭한 페이스트리와 프리미엄 토핑이 완성되는 순간을 영상으로 직접 만나보세요.
        </p>

        {/* Video Player Card Container */}
        <div className="max-w-4xl mx-auto mt-10">
          <div className="aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/50 dark:border-neutral-800/80 bg-black relative">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/9tTSo_q21qk?rel=0&modestbranding=1"
              title="120pie Brand Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
