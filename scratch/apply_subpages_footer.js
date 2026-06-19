const fs = require('fs');
const path = require('path');

const HomeV3Path = path.join(__dirname, '../app/v3/HomeV3.tsx');
const FranchisePath = path.join(__dirname, '../app/franchise/FranchisePageClient.tsx');
const StoresPath = path.join(__dirname, '../app/stores/StoresPageClient.tsx');
const CostsPath = path.join(__dirname, '../app/costs/CostsPageClient.tsx');

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

// 1. Update StoresPageClient.tsx
// 1-1. Add ArrowRight import and Footer import
let storesContent = fs.readFileSync(StoresPath, 'utf8').replace(/\r\n/g, '\n');
storesContent = storesContent.replace(
  `import { ArrowLeft, ArrowUpRight, MapPin, Store, ExternalLink, Menu, X } from "lucide-react";`,
  `import { ArrowLeft, ArrowUpRight, MapPin, Store, ExternalLink, Menu, X, ArrowRight } from "lucide-react";`
);
if (!storesContent.includes(`import Footer from "@/app/components/Footer";`)) {
  storesContent = storesContent.replace(
    `import FloatingAndInquiry from "@/app/components/FloatingAndInquiry";`,
    `import FloatingAndInquiry from "@/app/components/FloatingAndInquiry";\nimport Footer from "@/app/components/Footer";`
  );
}
fs.writeFileSync(StoresPath, storesContent, 'utf8');
console.log("Updated StoresPageClient.tsx imports.");

// 1-2. Add "상담 신청" button in header
const storesPortalTarget = `            <Link className={\`hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg border text-xs font-bold \${
              isYellow
                ? "border-[#e6dfc3] bg-white text-[#576575] hover:bg-[#fffcf0] hover:text-[#0d233a] transition-all"
                : "border-neutral-800 bg-neutral-900 text-neutral-350 hover:bg-neutral-800 hover:text-white transition-all"
            }\`} href="/portal" target="_blank" rel="noopener noreferrer">
              점주전용
            </Link>`;

const storesPortalReplacement = `            <Link className={\`hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg border text-xs font-bold \${
              isYellow
                ? "border-[#e6dfc3] bg-white text-[#576575] hover:bg-[#fffcf0] hover:text-[#0d233a] transition-all"
                : "border-neutral-800 bg-neutral-900 text-neutral-350 hover:bg-neutral-800 hover:text-white transition-all"
            }\`} href="/portal" target="_blank" rel="noopener noreferrer">
              점주전용
            </Link>
            <button
              type="button"
              onClick={() => setInquiryForcedOpen(true)}
              className={\`pink-primary-button hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-xs sm:text-sm font-black hover:scale-[1.02] transition-all border-0 cursor-pointer \${
                isPink 
                  ? "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_16px_rgba(244,63,94,0.2)]" 
                  : "bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-[0_4px_16px_rgba(251,191,36,0.2)]"
              }\`}
            >
              상담 신청 <ArrowRight size={14} className="ml-1.5 shrink-0" />
            </button>`;

replaceInFile(StoresPath, storesPortalTarget, storesPortalReplacement);

// 1-3. Add Footer component at the bottom
const storesBottomTarget = `          <FloatingAndInquiry
            forceOpenModal={inquiryForcedOpen}
            onModalClose={() => setInquiryForcedOpen(false)}
            isPink={isPink}
          />
        </div>
      </main>
    </div>`;

const storesBottomReplacement = `          <FloatingAndInquiry
            forceOpenModal={inquiryForcedOpen}
            onModalClose={() => setInquiryForcedOpen(false)}
            isPink={isPink}
          />
        </div>
      </main>
      <Footer theme={isPink ? "black" : "yellow"} />
    </div>`;

replaceInFile(StoresPath, storesBottomTarget, storesBottomReplacement);


// 2. Update CostsPageClient.tsx
// 2-1. Add ArrowRight import and Footer import
let costsContent = fs.readFileSync(CostsPath, 'utf8').replace(/\r\n/g, '\n');
costsContent = costsContent.replace(
  `import { ArrowLeft, ArrowUpRight, CheckCircle2, Sparkles, Truck, Flame, Layers, Menu, X } from "lucide-react";`,
  `import { ArrowLeft, ArrowUpRight, CheckCircle2, Sparkles, Truck, Flame, Layers, Menu, X, ArrowRight } from "lucide-react";`
);
if (!costsContent.includes(`import Footer from "@/app/components/Footer";`)) {
  costsContent = costsContent.replace(
    `import FloatingAndInquiry from "@/app/components/FloatingAndInquiry";`,
    `import FloatingAndInquiry from "@/app/components/FloatingAndInquiry";\nimport Footer from "@/app/components/Footer";`
  );
}
fs.writeFileSync(CostsPath, costsContent, 'utf8');
console.log("Updated CostsPageClient.tsx imports.");

// 2-2. Add "상담 신청" button in header
const costsPortalTarget = `            <Link className={\`hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg border text-xs font-bold \${
              isYellow
                ? "border-[#e6dfc3] bg-white text-[#576575] hover:bg-[#fffcf0] hover:text-[#0d233a] transition-all"
                : "border-neutral-800 bg-neutral-900 text-neutral-350 hover:bg-neutral-800 hover:text-white transition-all"
            }\`} href="/portal" target="_blank" rel="noopener noreferrer">
              점주전용
            </Link>`;

const costsPortalReplacement = `            <Link className={\`hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg border text-xs font-bold \${
              isYellow
                ? "border-[#e6dfc3] bg-white text-[#576575] hover:bg-[#fffcf0] hover:text-[#0d233a] transition-all"
                : "border-neutral-800 bg-neutral-900 text-neutral-350 hover:bg-neutral-800 hover:text-white transition-all"
            }\`} href="/portal" target="_blank" rel="noopener noreferrer">
              점주전용
            </Link>
            <button
              type="button"
              onClick={() => setInquiryForcedOpen(true)}
              className={\`pink-primary-button hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-xs sm:text-sm font-black hover:scale-[1.02] transition-all border-0 cursor-pointer \${
                isPink 
                  ? "bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_16px_rgba(244,63,94,0.2)]" 
                  : "bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-[0_4px_16px_rgba(251,191,36,0.2)]"
              }\`}
            >
              상담 신청 <ArrowRight size={14} className="ml-1.5 shrink-0" />
            </button>`;

replaceInFile(CostsPath, costsPortalTarget, costsPortalReplacement);

// 2-3. Add Footer component at bottom
const costsBottomTarget = `          <FloatingAndInquiry
            forceOpenModal={inquiryForcedOpen}
            onModalClose={() => setInquiryForcedOpen(false)}
            isPink={isPink}
          />
        </div>
      </main>
    </div>`;

const costsBottomReplacement = `          <FloatingAndInquiry
            forceOpenModal={inquiryForcedOpen}
            onModalClose={() => setInquiryForcedOpen(false)}
            isPink={isPink}
          />
        </div>
      </main>
      <Footer theme={isPink ? "black" : "yellow"} />
    </div>`;

replaceInFile(CostsPath, costsBottomTarget, costsBottomReplacement);


// 3. Update FranchisePageClient.tsx
// 3-1. Add imports for Footer and FloatingAndInquiry
let franchiseContent = fs.readFileSync(FranchisePath, 'utf8').replace(/\r\n/g, '\n');
if (!franchiseContent.includes(`import FloatingAndInquiry from "@/app/components/FloatingAndInquiry";`)) {
  franchiseContent = franchiseContent.replace(
    `import { useMutation } from "convex/react";`,
    `import { useMutation } from "convex/react";\nimport FloatingAndInquiry from "@/app/components/FloatingAndInquiry";\nimport Footer from "@/app/components/Footer";`
  );
}
fs.writeFileSync(FranchisePath, franchiseContent, 'utf8');
console.log("Updated FranchisePageClient.tsx imports.");

// 3-2. Replace simple footer and insert FloatingAndInquiry at bottom
const franchiseFooterTarget = `      {/* Footer */}
      <footer className="py-12 border-t border-neutral-200/20 text-center text-xs font-semibold text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <p>Address... (Placeholder footer text) ...</p>
        </div>
      </footer>`; // Wait, let's look at the exact target for the footer in FranchisePageClient.tsx from our previous view

const franchiseFooterTargetReal = `      {/* Footer */}
      <footer className="py-12 border-t border-neutral-200/20 text-center text-xs font-semibold text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <p>㈜일이공에프앤비 | 대표이사: 홍길동 | 서울특별시 강남구 역삼로 120, 5층</p>
          <p>가맹문의: 1566-0000 | 이메일: support@120pie.com | 사업자등록번호: 000-00-00000</p>
          <p className="text-[10px] text-slate-650">© 2026 120pie & coffee Corp. All rights reserved.</p>
        </div>
      </footer>`;

const franchiseFooterReplacement = `      <FloatingAndInquiry isPink={isPink} />
      <Footer theme={isPink ? "black" : "yellow"} />`;

replaceInFile(FranchisePath, franchiseFooterTargetReal, franchiseFooterReplacement);


// 4. Update HomeV3.tsx
// 4-1. Add Footer import
let homeContent = fs.readFileSync(HomeV3Path, 'utf8').replace(/\r\n/g, '\n');
if (!homeContent.includes(`import Footer from "@/app/components/Footer";`)) {
  homeContent = homeContent.replace(
    `import { useQuery, useMutation } from "convex/react";`,
    `import { useQuery, useMutation } from "convex/react";\nimport Footer from "@/app/components/Footer";`
  );
  fs.writeFileSync(HomeV3Path, homeContent, 'utf8');
}
console.log("Updated HomeV3.tsx imports.");

// 4-2. Replace inline footer in HomeV3.tsx
// We need to match the entire footer block exactly. Let's find its start and end
const homeFooterTargetStart = `      {/* ------------------------------------------------------------- */}
      {/* FOOTER */}
      {/* ------------------------------------------------------------- */}
      <footer className={\`border-t transition-all duration-300 \${
        isPinkVariant 
          ? "bg-[#fff1f4] border-rose-100 text-[#7c5d6c]" 
          : isYellowVariant 
            ? "bg-[#fff9e6] border-[#e6dfc3] text-[#576575]" 
            : "bg-[#090909] border-neutral-900 text-neutral-400"
      }\`}>`;

// Instead of matched blocks, let's write a targeted function to extract the footer block and replace it, or use literal replacement.
// Let's get the exact string. We know the footer goes from `<footer className=...` to `</footer>` at line 3481.
// Let's find it in homeContent.
const footerRegex = /\{\/\* \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \*\/\}\s+\{\/\* FOOTER \*\/\}[\s\S]+?<\/footer>/;
if (footerRegex.test(homeContent)) {
  homeContent = homeContent.replace(footerRegex, `{/* FOOTER */}\n      <Footer theme={isPinkVariant ? "pink" : isYellowVariant ? "yellow" : "black"} />`);
  fs.writeFileSync(HomeV3Path, homeContent, 'utf8');
  console.log("Successfully replaced footer in HomeV3.tsx");
} else {
  console.error("Footer regex not matched in HomeV3.tsx!");
}
