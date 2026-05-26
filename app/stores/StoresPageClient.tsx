"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MapPin, Store } from "lucide-react";
import { useState } from "react";

const logoUrl = "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779713831/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%9B%90%ED%98%95%EB%A1%9C%EA%B3%A02_nu_o4omab.png";

const stores = [
  {
    name: "120겹파이 AK플라자 금정점",
    address: "경기 군포시 엘에스로 143 1층 1001호",
    image: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779772271/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_AK%ED%94%8C%EB%9D%BC%EC%9E%90_%EA%B8%88%EC%A0%95%EC%A0%90_%EA%B2%BD%EA%B8%B0_%EA%B5%B0%ED%8F%AC%EC%8B%9C_%EC%97%98%EC%97%90%EC%8A%A4%EB%A1%9C_143_1%EC%B8%B5_1001%ED%98%B8_qcmpgs.jpg"
  },
  {
    name: "120겹파이 본점",
    address: "서울 성북구 돌곶이로14길 35 1층",
    image: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779772271/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EB%B3%B8%EC%A0%90_%EC%84%9C%EC%9A%B8_%EC%84%B1%EB%B6%81%EA%B5%AC_%EB%8F%8C%EA%B3%B6%EC%9D%B4%EB%A1%9C14%EA%B8%B8_35_1%EC%B8%B5_k9mjon.jpg"
  },
  {
    name: "120겹파이 삼산점",
    address: "인천 부평구 장제로228번길 24",
    image: "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779772272/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%82%BC%EC%82%B0%EC%A0%90_%EC%9D%B8%EC%B2%9C_%EB%B6%80%ED%8F%89%EA%B5%AC_%EC%9E%A5%EC%A0%9C%EB%A1%9C228%EB%B2%88%EA%B8%B8_24_o9q4qy.jpg"
  }
];

function naverMapUrl(name: string, address: string) {
  return `https://map.naver.com/p/search/${encodeURIComponent(`${name} ${address}`)}`;
}

export default function StoresPageClient() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = stores[selectedIndex];

  return (
    <div id="landing-v4" className="min-h-screen bg-neutral-950 text-neutral-900 font-sans antialiased">
      <header className="sticky top-0 z-20 backdrop-blur-md bg-neutral-950/95 border-b border-neutral-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[78px] flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 font-black text-xl text-white">
            <img src={logoUrl} alt="120pie 로고" className="w-11 h-11 object-contain" />
            <span className="font-extrabold whitespace-nowrap">120pie &amp; <span className="text-amber-400">coffee</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-full border border-neutral-800 bg-neutral-900/60 p-0.5 text-[10px] font-black">
              <Link href="/" className="landing-theme-active rounded-full bg-amber-400 px-2 py-1 text-white">핑크</Link>
              <Link href="/landing-v3" className="rounded-full px-2 py-1 text-neutral-400 hover:text-amber-400 transition-colors">블랙</Link>
            </div>
            <Link href="/portal" className="hidden sm:inline-flex px-4 py-2.5 rounded-lg border border-neutral-800 bg-neutral-900 text-xs font-bold text-neutral-400 hover:text-amber-400 transition-colors">
              점주전용
            </Link>
            <Link href="/" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-400 text-white text-xs font-black">
              <ArrowLeft size={14} /> 랜딩으로 돌아가기
            </Link>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="text-amber-600 font-bold tracking-widest text-xs uppercase mb-3 block font-mono">Stores</span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-950 leading-tight mb-4">
              가까운 곳에서 만나는<br />120pie 매장
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed">
              매장을 선택하면 주소를 확인하고 네이버지도에서 정확한 위치와 이동 경로를 살펴볼 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <section className="lg:col-span-7 space-y-4" aria-label="가맹점 목록">
              {stores.map((store, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    type="button"
                    key={store.name}
                    onClick={() => setSelectedIndex(index)}
                    className={`w-full overflow-hidden rounded-2xl border text-left transition-all bg-white ${isSelected ? "border-amber-400 shadow-xl" : "border-neutral-200 hover:border-amber-400/40"}`}
                  >
                    <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[180px_1fr] items-stretch">
                      <img src={store.image} alt={store.name} className="w-full h-full min-h-[124px] object-cover" />
                      <div className="p-5 sm:p-6 flex flex-col justify-center">
                        <span className="text-[10px] tracking-[0.22em] text-amber-600 font-black uppercase mb-2">120pie store</span>
                        <h2 className="text-base sm:text-xl font-black text-neutral-950 mb-2">{store.name}</h2>
                        <p className="text-xs sm:text-sm text-neutral-600 flex items-start gap-1.5 font-medium">
                          <MapPin size={15} className="mt-0.5 shrink-0 text-amber-600" />
                          {store.address}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </section>

            <aside className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="rounded-3xl bg-white border border-neutral-200 p-6 sm:p-8 shadow-xl">
                <div className="rounded-2xl bg-amber-50 border border-amber-100 min-h-[270px] px-7 py-9 flex flex-col items-center justify-center text-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-amber-400 text-white flex items-center justify-center mb-5 shadow-md">
                    <Store size={25} />
                  </div>
                  <span className="text-[10px] tracking-[0.2em] font-black text-amber-600 uppercase mb-3">Selected Store</span>
                  <h2 className="text-xl font-black text-neutral-950 mb-3">{selected.name}</h2>
                  <p className="text-sm font-medium text-neutral-600 leading-relaxed">{selected.address}</p>
                </div>
                <a
                  href={naverMapUrl(selected.name, selected.address)}
                  target="_blank"
                  rel="noreferrer"
                  className="pink-primary-button flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-4 text-sm font-black text-white hover:bg-amber-300 transition-colors"
                >
                  네이버지도에서 위치 보기 <ArrowUpRight size={17} />
                </a>
                <p className="mt-4 text-center text-xs font-medium text-neutral-500">
                  선택한 매장의 주소로 네이버지도 검색 화면이 열립니다.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
