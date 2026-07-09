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
    <section className="relative bg-[#0F3587] pt-10 pb-16 sm:pt-28 sm:pb-36 overflow-hidden">
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
    </section>
  );
}
