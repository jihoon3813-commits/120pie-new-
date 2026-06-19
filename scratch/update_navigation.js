const fs = require('fs');
const path = require('path');

const HomeV3Path = path.join(__dirname, '../app/v3/HomeV3.tsx');
const FranchisePath = path.join(__dirname, '../app/franchise/FranchisePageClient.tsx');
const StoresPath = path.join(__dirname, '../app/stores/StoresPageClient.tsx');
const CostsPath = path.join(__dirname, '../app/costs/CostsPageClient.tsx');

function replaceWithRegex(filePath, regex, replacement) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/\r\n/g, '\n');
  if (!regex.test(content)) {
    console.error(`Regex not matched in ${path.basename(filePath)}!`);
    return false;
  }
  content = content.replace(regex, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully regex-updated ${path.basename(filePath)}`);
  return true;
}

function replaceInFile(filePath, target, replacement) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/\r\n/g, '\n');
  const normalizedTarget = target.replace(/\r\n/g, '\n');
  const normalizedReplacement = replacement.replace(/\r\n/g, '\n');
  
  if (!content.includes(normalizedTarget)) {
    console.error(`Target not found in ${path.basename(filePath)}!`);
    return false;
  }
  content = content.replace(normalizedTarget, normalizedReplacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully updated ${path.basename(filePath)}`);
  return true;
}

// 1. Update HomeV3.tsx
const homeNavRegex = /<nav className=\{\`hidden lg:flex items-center gap-2\.5 xl:gap-4 text-\[10px\] xl:text-\[13px\] font-bold shrink-0 \$\{navLinkTextClass\}\`\}>[\s\S]+?<\/nav>/;

const homeReplacement1 = `          <nav className={\`hidden lg:flex items-center gap-2.5 xl:gap-4 text-[10px] xl:text-[13px] font-bold shrink-0 \${navLinkTextClass}\`}>
            <a href="#menu" className="hover:text-amber-400 transition-colors">메뉴</a>
            <Link href={isPinkVariant ? "/stores?theme=pink" : "/stores?theme=yellow"} className="hover:text-amber-400 transition-colors shrink-0">
              가맹점 현황
            </Link>
            <Link href={isPinkVariant ? "/costs?theme=pink" : "/costs?theme=yellow"} className="hover:text-amber-400 transition-colors shrink-0">
              비용 안내
            </Link>
            <Link href={isPinkVariant ? "/franchise?theme=pink" : "/franchise?theme=yellow"} className="hover:text-amber-400 transition-colors shrink-0">
              창업 안내
            </Link>
            <a href="#faq" className="hover:text-amber-400 transition-colors">FAQ</a>
          </nav>`;

replaceWithRegex(HomeV3Path, homeNavRegex, homeReplacement1);

const homeTarget2 = `        {mobileNavOpen && (
          <nav id="mobile-landing-nav" className={\`lg:hidden border-t px-4 pb-5 pt-3.5 transition-all duration-300 \${mobileNavDrawerBgClass}\`}>
            <div className="grid grid-cols-2 gap-2 text-sm font-bold">
              {[
                { label: "도입 가치", href: "#why" },
                { label: "브랜드 구조", href: "#structure" },
                { label: "메뉴 카탈로그", href: "#menu" },
                { label: "수익 시뮬레이터", href: "#simulator" },
                { label: "도입 방식", href: "#adoption" },
                { label: "FAQ", href: "#faq" }
              ].map(item => (
                <a key={item.href} href={item.href} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                  {item.label}
                </a>
              ))}
              <Link href={isPinkVariant ? "/stores?theme=pink" : "/stores?theme=yellow"} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                가맹점 현황
              </Link>
              <Link href="/portal" target="_blank" rel="noopener noreferrer" onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                점주전용
              </Link>
            </div>`;

const homeReplacement2 = `        {mobileNavOpen && (
          <nav id="mobile-landing-nav" className={\`lg:hidden border-t px-4 pb-5 pt-3.5 transition-all duration-300 \${mobileNavDrawerBgClass}\`}>
            <div className="grid grid-cols-2 gap-2 text-sm font-bold">
              <a href="#menu" onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                메뉴
              </a>
              <Link href={isPinkVariant ? "/stores?theme=pink" : "/stores?theme=yellow"} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                가맹점 현황
              </Link>
              <Link href={isPinkVariant ? "/costs?theme=pink" : "/costs?theme=yellow"} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                비용 안내
              </Link>
              <Link href={isPinkVariant ? "/franchise?theme=pink" : "/franchise?theme=yellow"} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                창업 안내
              </Link>
              <a href="#faq" onClick={() => setMobileNavOpen(false)} className={\`col-span-2 rounded-xl px-4 py-3 transition-colors text-center \${mobileNavLinkClass}\`}>
                FAQ
              </a>
            </div>`;

replaceInFile(HomeV3Path, homeTarget2, homeReplacement2);


// 2. Update FranchisePageClient.tsx
const franchiseTarget1 = `          <nav className={\`hidden lg:flex items-center gap-2.5 xl:gap-4 text-[10px] xl:text-[13px] font-bold shrink-0 \${navLinkTextClass}\`}>
            <Link href={\`\${backUrl}#menu\`} className="hover:text-amber-400 transition-colors">메뉴 카탈로그</Link>
            <Link href={\`/stores?theme=\${theme}\`} className="hover:text-amber-400 transition-colors">가맹점 현황</Link>
            <Link href={\`/costs?theme=\${theme}\`} className="hover:text-amber-400 transition-colors">샵인샵 안내</Link>
            <Link href={\`/franchise?theme=\${theme}\`} className={\`hover:scale-105 transition-transform shrink-0 \${
              isPink 
                ? "text-rose-500 hover:text-rose-600 font-extrabold" 
                : "text-[#ffd500] hover:text-[#e6bd00] font-extrabold"
            }\`}>
              창업 안내
            </Link>
            <Link href={\`\${backUrl}#faq\`} className="hover:text-amber-400 transition-colors">FAQ</Link>
          </nav>`;

const franchiseReplacement1 = `          <nav className={\`hidden lg:flex items-center gap-2.5 xl:gap-4 text-[10px] xl:text-[13px] font-bold shrink-0 \${navLinkTextClass}\`}>
            <Link href={\`\${backUrl}#menu\`} className="hover:text-amber-400 transition-colors">메뉴</Link>
            <Link href={\`/stores?theme=\${theme}\`} className="hover:text-amber-400 transition-colors">가맹점 현황</Link>
            <Link href={\`/costs?theme=\${theme}\`} className="hover:text-amber-400 transition-colors">비용 안내</Link>
            <Link href={\`/franchise?theme=\${theme}\`} className={\`hover:scale-105 transition-transform shrink-0 \${
              isPink 
                ? "text-rose-500 hover:text-rose-600 font-extrabold" 
                : "text-[#ffd500] hover:text-[#e6bd00] font-extrabold"
            }\`}>
              창업 안내
            </Link>
            <Link href={\`\${backUrl}#faq\`} className="hover:text-amber-400 transition-colors">FAQ</Link>
          </nav>`;

const franchiseTarget2 = `        {mobileNavOpen && (
          <nav id="mobile-landing-nav" className={\`lg:hidden border-t px-4 pb-5 pt-3.5 transition-all duration-300 \${mobileNavDrawerBgClass}\`}>
            <div className="grid grid-cols-2 gap-2 text-sm font-bold">
              <Link href={\`\${backUrl}#menu\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                메뉴 카탈로그
              </Link>
              <Link href={\`/stores?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                가맹점 현황
              </Link>
              <Link href={\`/costs?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                샵인샵 안내
              </Link>
              <Link href={\`/franchise?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors font-extrabold \${
                isPink 
                  ? "text-rose-500 bg-rose-500/10 border border-rose-500/20" 
                  : "text-[#ffd500] bg-[#ffd500]/10 border border-[#ffd500]/20"
              }\`}>
                창업 안내
              </Link>
              <Link href={\`\${backUrl}#faq\`} onClick={() => setMobileNavOpen(false)} className={\`col-span-2 rounded-xl px-4 py-3 transition-colors text-center \${mobileNavLinkClass}\`}>
                FAQ
              </Link>
            </div>`;

const franchiseReplacement2 = `        {mobileNavOpen && (
          <nav id="mobile-landing-nav" className={\`lg:hidden border-t px-4 pb-5 pt-3.5 transition-all duration-300 \${mobileNavDrawerBgClass}\`}>
            <div className="grid grid-cols-2 gap-2 text-sm font-bold">
              <Link href={\`\${backUrl}#menu\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                메뉴
              </Link>
              <Link href={\`/stores?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                가맹점 현황
              </Link>
              <Link href={\`/costs?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                비용 안내
              </Link>
              <Link href={\`/franchise?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors font-extrabold \${
                isPink 
                  ? "text-rose-500 bg-rose-500/10 border border-rose-500/20" 
                  : "text-[#ffd500] bg-[#ffd500]/10 border border-[#ffd500]/20"
              }\`}>
                창업 안내
              </Link>
              <Link href={\`\${backUrl}#faq\`} onClick={() => setMobileNavOpen(false)} className={\`col-span-2 rounded-xl px-4 py-3 transition-colors text-center \${mobileNavLinkClass}\`}>
                FAQ
              </Link>
            </div>`;

replaceInFile(FranchisePath, franchiseTarget1, franchiseReplacement1);
replaceInFile(FranchisePath, franchiseTarget2, franchiseReplacement2);


// 3. Update StoresPageClient.tsx (Requires adding state and lucide icon imports, and rebuilding header)
let storesContent = fs.readFileSync(StoresPath, 'utf8').replace(/\r\n/g, '\n');
storesContent = storesContent.replace(
  `import { ArrowLeft, ArrowUpRight, MapPin, Store, ExternalLink } from "lucide-react";`,
  `import { ArrowLeft, ArrowUpRight, MapPin, Store, ExternalLink, Menu, X } from "lucide-react";`
);

// Add mobileNavOpen state
if (!storesContent.includes('const [mobileNavOpen, setMobileNavOpen] = useState(false);')) {
  storesContent = storesContent.replace(
    `const [selectedRegion, setSelectedRegion] = useState<string>("전체");`,
    `const [selectedRegion, setSelectedRegion] = useState<string>("전체");\n  const [mobileNavOpen, setMobileNavOpen] = useState(false);`
  );
}

// Replace header block
const storesHeaderTarget = `      {/* Dynamic Header */}
      <header className={\`sticky top-0 z-20 backdrop-blur-md transition-colors duration-300 \${headerBg}\`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[60px] sm:min-h-[78px] flex items-center justify-between gap-2 sm:gap-4">
          <Link href={backUrl} className="flex items-center group shrink-0">
            <img src={logoUrl} alt="120pie & coffee" className="h-5 sm:h-8 w-auto object-contain group-hover:scale-102 transition-transform" />
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Dynamic theme switcher on the page itself */}
            <div className="flex items-center rounded-full border border-neutral-300 dark:border-neutral-800 bg-neutral-900/5 dark:bg-neutral-900/60 p-0.5 text-[10px] font-black">
              <button
                type="button"
                onClick={() => handleThemeChange("yellow")}
                className={\`rounded-full px-2.5 py-1 sm:px-2.5 sm:py-1.5 transition-colors cursor-pointer border-0 \${
                  isYellow 
                    ? "bg-amber-400 text-neutral-950 shadow-sm font-extrabold" 
                    : "text-neutral-400 hover:text-white"
                }\`}
              >
                옐로
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange("pink")}
                className={\`rounded-full px-2.5 py-1 sm:px-2.5 sm:py-1.5 transition-colors cursor-pointer border-0 \${
                  isPink 
                    ? "bg-amber-400 text-neutral-950 shadow-sm font-extrabold" 
                    : "text-neutral-400 hover:text-white"
                }\`}
              >
                블랙
              </button>
            </div>

            <Link href="/portal" className={\`hidden sm:inline-flex px-4 py-2 rounded-lg border text-xs font-bold transition-colors \${
              isPink ? "border-neutral-300 bg-neutral-100 text-neutral-600 hover:bg-neutral-200" : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-amber-400"
            }\`}>
              점주전용 포탈
            </Link>
            <Link href={backUrl} className={\`inline-flex items-center gap-1 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-black transition-all \${backBtnClass}\`}>
              <ArrowLeft size={13} className="sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">메인 랜딩으로 돌아가기</span>
              <span className="sm:hidden">메인으로</span>
            </Link>
          </div>
        </div>
      </header>`.replace(/\r\n/g, '\n');

const storesHeaderReplacement = `      {/* Dynamic Header */}
      <header className={\`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 \${headerBg}\`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-[60px] sm:min-h-[80px] lg:min-h-[94px] gap-2.5 sm:gap-4">
          <div className="shrink-0 py-2">
            <Link className="flex items-center group shrink-0" href={backUrl} aria-label="120pie 홈으로 이동">
              <img
                src={logoUrl}
                alt="120pie & coffee"
                className="h-5 sm:h-7 lg:h-8 w-auto object-contain group-hover:scale-102 transition-all duration-200"
              />
            </Link>
          </div>

          <nav className={\`hidden lg:flex items-center justify-center gap-2.5 xl:gap-4 text-[10px] xl:text-[13px] font-bold shrink-0 \${isPink ? "text-neutral-400 hover:text-rose-400" : "text-[#576575] hover:text-[#0d233a]"}\`}>
            <Link href={\`\${backUrl}#menu\`} className="hover:text-amber-400 transition-colors">메뉴</Link>
            <Link href={\`/stores?theme=\${theme}\`} className={\`hover:scale-105 transition-transform shrink-0 \${
              isPink 
                ? "text-rose-500 hover:text-rose-600 font-extrabold" 
                : "text-[#ffd500] hover:text-[#e6bd00] font-extrabold"
            }\`}>
              가맹점 현황
            </Link>
            <Link href={\`/costs?theme=\${theme}\`} className="hover:text-amber-400 transition-colors">비용 안내</Link>
            <Link href={\`/franchise?theme=\${theme}\`} className="hover:text-amber-400 transition-colors">창업 안내</Link>
            <Link href={\`\${backUrl}#faq\`} className="hover:text-amber-400 transition-colors">FAQ</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className={\`flex items-center rounded-full border p-0.5 text-[10px] font-black \${isPink ? "border-[#f2ccd7]/20 bg-neutral-900/60" : "border-[#e6dfc3] bg-neutral-900/5"}\`}>
              <button
                type="button"
                onClick={() => handleThemeChange("yellow")}
                className={\`rounded-full px-2.5 py-1 transition-colors cursor-pointer border-0 \${
                  isYellow 
                    ? "landing-theme-active bg-amber-400 text-neutral-950 font-extrabold shadow-sm" 
                    : isPink ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-[#0d233a]"
                }\`}
              >
                옐로
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange("pink")}
                className={\`rounded-full px-2.5 py-1 transition-colors cursor-pointer border-0 \${
                  isPink 
                    ? "landing-theme-active bg-amber-400 text-neutral-950 font-extrabold shadow-sm" 
                    : "text-neutral-500 hover:text-[#0d233a]"
                }\`}
              >
                블랙
              </button>
            </div>
            <Link className={\`hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg border text-xs font-bold \${
              isYellow
                ? "border-[#e6dfc3] bg-white text-[#576575] hover:bg-[#fffcf0] hover:text-[#0d233a] transition-all"
                : "border-neutral-800 bg-neutral-900 text-neutral-350 hover:bg-neutral-800 hover:text-white transition-all"
            }\`} href="/portal" target="_blank" rel="noopener noreferrer">
              점주전용
            </Link>
            <button
              type="button"
              className={\`pink-primary-button lg:hidden inline-flex items-center justify-center rounded-lg p-2.5 text-xs font-black border-0 cursor-pointer \${
                isPink 
                  ? "bg-rose-500 text-white hover:bg-rose-600" 
                  : "bg-amber-400 text-neutral-950 hover:bg-amber-300"
              }\`}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-landing-nav"
              onClick={() => setMobileNavOpen(open => !open)}
            >
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {mobileNavOpen && (
          <nav id="mobile-landing-nav" className={\`lg:hidden border-t px-4 pb-5 pt-3.5 transition-all duration-300 \${isYellow ? "bg-[#fffdf2]/98 border-t border-[#e6dfc3]/60" : "bg-[#0f0a0c]/98 border-t border-[#f2ccd7]/15"}\`}>
            <div className="grid grid-cols-2 gap-2 text-sm font-bold">
              <Link href={\`\${backUrl}#menu\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${isYellow ? "bg-white border border-[#e6dfc3]/60 text-[#576575]" : "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400"}\`}>
                메뉴
              </Link>
              <Link href={\`/stores?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors font-extrabold \${
                isPink 
                  ? "text-rose-500 bg-rose-500/10 border border-rose-500/20" 
                  : "text-[#ffd500] bg-[#ffd500]/10 border border-[#ffd500]/20"
              }\`}>
                가맹점 현황
              </Link>
              <Link href={\`/costs?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${isYellow ? "bg-white border border-[#e6dfc3]/60 text-[#576575]" : "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400"}\`}>
                비용 안내
              </Link>
              <Link href={\`/franchise?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${isYellow ? "bg-white border border-[#e6dfc3]/60 text-[#576575]" : "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400"}\`}>
                창업 안내
              </Link>
              <Link href={\`\${backUrl}#faq\`} onClick={() => setMobileNavOpen(false)} className={\`col-span-2 rounded-xl px-4 py-3 transition-colors text-center \${isYellow ? "bg-white border border-[#e6dfc3]/60 text-[#576575]" : "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400"}\`}>
                FAQ
              </Link>
            </div>
          </nav>
        )}
      </header>`.replace(/\r\n/g, '\n');

if (storesContent.includes(storesHeaderTarget)) {
  storesContent = storesContent.replace(storesHeaderTarget, storesHeaderReplacement);
  fs.writeFileSync(StoresPath, storesContent, 'utf8');
  console.log(`Successfully updated StoresPageClient.tsx`);
} else {
  console.error("StoresPageClient.tsx header target not found!");
}


// 4. Update CostsPageClient.tsx
let costsContent = fs.readFileSync(CostsPath, 'utf8').replace(/\r\n/g, '\n');
costsContent = costsContent.replace(
  `import { ArrowLeft, ArrowUpRight, CheckCircle2, Sparkles, Truck, Flame, Layers } from "lucide-react";`,
  `import { ArrowLeft, ArrowUpRight, CheckCircle2, Sparkles, Truck, Flame, Layers, Menu, X } from "lucide-react";`
);

// Add mobileNavOpen state
if (!costsContent.includes('const [mobileNavOpen, setMobileNavOpen] = useState(false);')) {
  costsContent = costsContent.replace(
    `const [inquiryForcedOpen, setInquiryForcedOpen] = useState(false);`,
    `const [inquiryForcedOpen, setInquiryForcedOpen] = useState(false);\n  const [mobileNavOpen, setMobileNavOpen] = useState(false);`
  );
}

// Replace header block
const costsHeaderTarget = `      {/* Header */}
      <header className={\`sticky top-0 z-20 backdrop-blur-md transition-colors duration-300 \${headerBg}\`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[60px] sm:min-h-[78px] flex items-center justify-between gap-2 sm:gap-4">
          <Link href={backUrl} className="flex items-center group shrink-0">
            <img src={logoUrl} alt="120pie & coffee" className="h-5 sm:h-8 w-auto object-contain group-hover:scale-[1.02] transition-transform" />
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Theme switcher */}
            <div className="flex items-center rounded-full border border-neutral-355 dark:border-neutral-800 bg-neutral-900/5 dark:bg-neutral-900/60 p-0.5 text-[10px] font-black">
              <button
                type="button"
                onClick={() => handleThemeChange("yellow")}
                className={\`rounded-full px-2.5 py-1 sm:px-2.5 sm:py-1.5 transition-colors cursor-pointer border-0 \${
                  isYellow 
                    ? "bg-amber-400 text-neutral-950 shadow-sm font-extrabold" 
                    : "text-neutral-400 hover:text-white"
                }\`}
              >
                옐로
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange("pink")}
                className={\`rounded-full px-2.5 py-1 sm:px-2.5 sm:py-1.5 transition-colors cursor-pointer border-0 \${
                  isPink 
                    ? "bg-amber-400 text-neutral-950 shadow-sm font-extrabold" 
                    : "text-neutral-400 hover:text-white"
                }\`}
              >
                블랙
              </button>
            </div>

            <Link href="/portal" className={\`hidden sm:inline-flex px-4 py-2 rounded-lg border text-xs font-bold transition-colors \${
              isPink ? "border-neutral-355 bg-neutral-100 text-neutral-600 hover:bg-neutral-200" : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-amber-400"
            }\`}>
              점주전용 포탈
            </Link>
            <Link href={backUrl} className={\`inline-flex items-center gap-1 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-black transition-all \${backBtnClass}\`}>
              <ArrowLeft size={13} className="sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">메인 랜딩으로 돌아가기</span>
              <span className="sm:hidden">메인으로</span>
            </Link>
          </div>
        </div>
      </header>`.replace(/\r\n/g, '\n');

const costsHeaderReplacement = `      {/* Header */}
      <header className={\`sticky top-0 z-50 backdrop-blur-md transition-all duration-300 \${headerBg}\`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-[60px] sm:min-h-[80px] lg:min-h-[94px] gap-2.5 sm:gap-4">
          <div className="shrink-0 py-2">
            <Link className="flex items-center group shrink-0" href={backUrl} aria-label="120pie 홈으로 이동">
              <img
                src={logoUrl}
                alt="120pie & coffee"
                className="h-5 sm:h-7 lg:h-8 w-auto object-contain group-hover:scale-102 transition-all duration-200"
              />
            </Link>
          </div>

          <nav className={\`hidden lg:flex items-center justify-center gap-2.5 xl:gap-4 text-[10px] xl:text-[13px] font-bold shrink-0 \${isPink ? "text-neutral-400 hover:text-rose-400" : "text-[#576575] hover:text-[#0d233a]"}\`}>
            <Link href={\`\${backUrl}#menu\`} className="hover:text-amber-400 transition-colors">메뉴</Link>
            <Link href={\`/stores?theme=\${theme}\`} className="hover:text-amber-400 transition-colors">가맹점 현황</Link>
            <Link href={\`/costs?theme=\${theme}\`} className={\`hover:scale-105 transition-transform shrink-0 \${
              isPink 
                ? "text-rose-500 hover:text-rose-600 font-extrabold" 
                : "text-[#ffd500] hover:text-[#e6bd00] font-extrabold"
            }\`}>
              비용 안내
            </Link>
            <Link href={\`/franchise?theme=\${theme}\`} className="hover:text-amber-400 transition-colors">창업 안내</Link>
            <Link href={\`\${backUrl}#faq\`} className="hover:text-amber-400 transition-colors">FAQ</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className={\`flex items-center rounded-full border p-0.5 text-[10px] font-black \${isPink ? "border-[#f2ccd7]/20 bg-neutral-900/60" : "border-[#e6dfc3] bg-neutral-900/5"}\`}>
              <button
                type="button"
                onClick={() => handleThemeChange("yellow")}
                className={\`rounded-full px-2.5 py-1 transition-colors cursor-pointer border-0 \${
                  isYellow 
                    ? "landing-theme-active bg-amber-400 text-neutral-950 font-extrabold shadow-sm" 
                    : isPink ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-[#0d233a]"
                }\`}
              >
                옐로
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange("pink")}
                className={\`rounded-full px-2.5 py-1 transition-colors cursor-pointer border-0 \${
                  isPink 
                    ? "landing-theme-active bg-amber-400 text-neutral-950 font-extrabold shadow-sm" 
                    : "text-neutral-500 hover:text-[#0d233a]"
                }\`}
              >
                블랙
              </button>
            </div>
            <Link className={\`hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg border text-xs font-bold \${
              isYellow
                ? "border-[#e6dfc3] bg-white text-[#576575] hover:bg-[#fffcf0] hover:text-[#0d233a] transition-all"
                : "border-neutral-800 bg-neutral-900 text-neutral-350 hover:bg-neutral-800 hover:text-white transition-all"
            }\`} href="/portal" target="_blank" rel="noopener noreferrer">
              점주전용
            </Link>
            <button
              type="button"
              className={\`pink-primary-button lg:hidden inline-flex items-center justify-center rounded-lg p-2.5 text-xs font-black border-0 cursor-pointer \${
                isPink 
                  ? "bg-rose-500 text-white hover:bg-rose-600" 
                  : "bg-amber-400 text-neutral-950 hover:bg-amber-300"
              }\`}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-landing-nav"
              onClick={() => setMobileNavOpen(open => !open)}
            >
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {mobileNavOpen && (
          <nav id="mobile-landing-nav" className={\`lg:hidden border-t px-4 pb-5 pt-3.5 transition-all duration-300 \${isYellow ? "bg-[#fffdf2]/98 border-t border-[#e6dfc3]/60" : "bg-[#0f0a0c]/98 border-t border-[#f2ccd7]/15"}\`}>
            <div className="grid grid-cols-2 gap-2 text-sm font-bold">
              <Link href={\`\${backUrl}#menu\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${isYellow ? "bg-white border border-[#e6dfc3]/60 text-[#576575]" : "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400"}\`}>
                메뉴
              </Link>
              <Link href={\`/stores?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${isYellow ? "bg-white border border-[#e6dfc3]/60 text-[#576575]" : "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400"}\`}>
                가맹점 현황
              </Link>
              <Link href={\`/costs?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors font-extrabold \${
                isPink 
                  ? "text-rose-500 bg-rose-500/10 border border-rose-500/20" 
                  : "text-[#ffd500] bg-[#ffd500]/10 border border-[#ffd500]/20"
              }\`}>
                비용 안내
              </Link>
              <Link href={\`/franchise?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${isYellow ? "bg-white border border-[#e6dfc3]/60 text-[#576575]" : "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400"}\`}>
                창업 안내
              </Link>
              <Link href={\`\${backUrl}#faq\`} onClick={() => setMobileNavOpen(false)} className={\`col-span-2 rounded-xl px-4 py-3 transition-colors text-center \${isYellow ? "bg-white border border-[#e6dfc3]/60 text-[#576575]" : "bg-[#181114] border border-[#f2ccd7]/10 text-neutral-400"}\`}>
                FAQ
              </Link>
            </div>
          </nav>
        )}
      </header>`.replace(/\r\n/g, '\n');

if (costsContent.includes(costsHeaderTarget)) {
  costsContent = costsContent.replace(costsHeaderTarget, costsHeaderReplacement);
  fs.writeFileSync(CostsPath, costsContent, 'utf8');
  console.log(`Successfully updated CostsPageClient.tsx`);
} else {
  console.error("CostsPageClient.tsx header target not found!");
}
