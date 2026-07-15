"use client";

export default function YouTubeVideoSection() {
  return (
    <section className="relative w-full h-[50vh] sm:h-[65vh] lg:h-[80vh] overflow-hidden bg-black z-0 border-none">
      {/* Top and Bottom soft shading overlays to blend smoothly with adjacent sections */}
      <div className="absolute top-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-white/15 to-transparent dark:from-neutral-950/25 pointer-events-none z-10" />

      {/* Video Container cropped to cover the full width/height (16:9 ratio preservation) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none bg-black">
        <iframe
          src="https://www.youtube.com/embed/9tTSo_q21qk?autoplay=1&mute=1&loop=1&playlist=9tTSo_q21qk&playsinline=1&controls=0&showinfo=0&rel=0&enablejsapi=1"
          title="120pie YouTube Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.77vh] min-w-full h-[56.25vw] min-h-full object-cover pointer-events-none scale-[1.15]"
        />
        {/* 투명한 오버레이 레이어로 터치 및 클릭 이벤트를 차단하여 정지 버튼 등 유튜브 컨트롤러가 노출되는 것을 완전히 막음 */}
        <div className="absolute inset-0 w-full h-full bg-transparent z-20 pointer-events-auto" />
      </div>

      {/* Subtle brand watermark or overlay in the corner for premium feel (Optional) */}
      <div className="absolute bottom-16 right-6 z-10 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 hidden sm:block">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/80 font-mono">
          120PIE & COFFEE
        </span>
      </div>
    </section>
  );
}
