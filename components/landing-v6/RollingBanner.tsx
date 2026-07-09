"use client";

export default function RollingBanner() {
  const images = [
    "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783339878/edited-photo_-_2026-07-06T205234.943_ogitxz.png",
    "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783339878/edited-photo_-_2026-07-06T205157.616_yvuitm.png",
    "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783339878/edited-photo_-_2026-07-06T205339.363_tbme0q.png",
    "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783339878/edited-photo_-_2026-07-06T205317.175_oassne.png",
    "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783339878/edited-photo_-_2026-07-06T205253.933_icyegq.png",
    "https://res.cloudinary.com/dfkntvpmv/image/upload/f_auto,q_auto/v1783339879/edited-photo_-_2026-07-06T205216.334_js5wiw.png",
  ];

  // Repeat images to create infinite scrolling effect
  const doubleImages = [...images, ...images];

  return (
    <section className="relative z-10 bg-[#0F3587] pt-10 pb-16 sm:pt-28 sm:pb-36 overflow-hidden">
      <div className="relative w-full overflow-hidden">
        {/* Soft edge masking for premium look */}
        <div className="absolute inset-y-0 left-0 w-8 sm:w-24 bg-gradient-to-r from-[#0F3587] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-8 sm:w-24 bg-gradient-to-l from-[#0F3587] to-transparent z-10 pointer-events-none" />

        {/* Rolling track */}
        <div className="flex w-max animate-marquee">
          {doubleImages.map((src, index) => (
            <div
              key={index}
              className="w-[55vw] sm:w-[33.333vw] px-2 sm:px-4 shrink-0"
            >
              {/* Removed borders, outlines and shadows for a flat, borderless card design */}
              <div className="aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden">
                <img
                  src={src}
                  alt={`Pie rolling item ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global CSS animation - Removed hover play state pause */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
      `}</style>

      {/* Wavy transition boundary to YouTubeVideoSection (Matching white background) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[2px]">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="relative block w-full h-[24px] sm:h-[40px] lg:h-[55px] text-white dark:text-neutral-950">
          <path
            d="M 0 50 Q 25 10, 50 50 Q 75 90, 100 50 Q 125 10, 150 50 Q 175 90, 200 50 Q 225 10, 250 50 Q 275 90, 300 50 Q 325 10, 350 50 Q 375 90, 400 50 Q 425 10, 450 50 Q 475 90, 500 50 Q 525 10, 550 50 Q 575 90, 600 50 Q 625 10, 650 50 Q 675 90, 700 50 Q 725 10, 750 50 Q 775 90, 800 50 Q 825 10, 850 50 Q 875 90, 900 50 Q 925 10, 950 50 Q 975 90, 1000 50 Q 1025 10, 1050 50 Q 1075 90, 1100 50 Q 1125 10, 1150 50 Q 1175 90, 1200 50 L 1200 100 L 0 100 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}
