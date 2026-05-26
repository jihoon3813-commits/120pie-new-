import Link from "next/link";
import { ArrowLeft, ClipboardList, Headphones, Package } from "lucide-react";

const logoUrl = "https://res.cloudinary.com/dx7l09wwu/image/upload/v1779713831/120%EA%B2%B9%ED%8C%8C%EC%9D%B4_%EC%9B%90%ED%98%95%EB%A1%9C%EA%B3%A02_nu_o4omab.png";

export const metadata = {
  title: "점주전용 | 120pie & coffee"
};

export default function PortalPage() {
  return (
    <div id="landing-v4" className="min-h-screen bg-neutral-950 font-sans text-neutral-900">
      <header className="border-b border-neutral-900/60 bg-neutral-950/95">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 min-h-[78px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-black text-xl text-white">
            <img src={logoUrl} alt="120pie 로고" className="w-11 h-11 object-contain" />
            <span>120pie &amp; <span className="text-amber-400">coffee</span></span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-amber-600">
            <ArrowLeft size={16} /> 메인으로
          </Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
        <div className="max-w-2xl mb-12">
          <span className="text-amber-600 font-bold tracking-widest text-xs uppercase mb-3 block font-mono">Owner Support</span>
          <h1 className="text-4xl sm:text-5xl font-black text-neutral-950 tracking-tight mb-5">점주전용 지원센터</h1>
          <p className="text-neutral-600 leading-relaxed font-medium">
            운영 자료, 발주 안내, 문의 지원을 한곳에서 제공하기 위한 점주전용 화면입니다. 현재 이용 문의는 상담 창구를 통해 안내해드립니다.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-5 mb-12">
          {[
            { icon: Package, title: "발주 안내", desc: "판매에 필요한 재료와 소모품 안내" },
            { icon: ClipboardList, title: "운영 자료", desc: "메뉴 운영 및 홍보 자료 확인" },
            { icon: Headphones, title: "문의 지원", desc: "운영 중 필요한 지원 상담" }
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl bg-white border border-neutral-200 p-6">
              <Icon className="text-amber-600 mb-4" size={21} />
              <h2 className="font-black text-neutral-950 mb-2">{title}</h2>
              <p className="text-sm text-neutral-600 font-medium leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <Link href="/#contact" className="pink-primary-button inline-flex rounded-xl bg-amber-400 px-7 py-4 text-sm font-black text-white">
          점주 상담 문의하기
        </Link>
      </main>
    </div>
  );
}
