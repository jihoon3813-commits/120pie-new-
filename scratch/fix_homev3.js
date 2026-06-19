const fs = require('fs');
const path = require('path');

const HomeV3Path = path.join(__dirname, '../app/v3/HomeV3.tsx');

let content = fs.readFileSync(HomeV3Path, 'utf8');
content = content.replace(/\r\n/g, '\n');

// 1. Replace desktop nav links
const oldDesktopNav = `                    <nav className={\`hidden lg:flex items-center gap-2.5 xl:gap-4 text-[10px] xl:text-[13px] font-bold shrink-0 \${navLinkTextClass}\`}>
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

const newDesktopNav = `          <nav className={\`hidden lg:flex items-center gap-2.5 xl:gap-4 text-[10px] xl:text-[13px] font-bold shrink-0 \${navLinkTextClass}\`}>
            <a href="#menu" className="hover:text-amber-400 transition-colors">메뉴</a>
            <Link href={isYellowVariant ? "/stores?theme=yellow" : "/stores?theme=pink"} className="hover:text-amber-400 transition-colors shrink-0">
              가맹점 현황
            </Link>
            <Link href={isYellowVariant ? "/costs?theme=yellow" : "/costs?theme=pink"} className="hover:text-amber-400 transition-colors shrink-0">
              비용 안내
            </Link>
            <Link href={isYellowVariant ? "/franchise?theme=yellow" : "/franchise?theme=pink"} className="hover:text-amber-400 transition-colors shrink-0">
              창업 안내
            </Link>
            <a href="#faq" className="hover:text-amber-400 transition-colors">FAQ</a>
          </nav>`;

if (content.includes(oldDesktopNav)) {
  content = content.replace(oldDesktopNav, newDesktopNav);
  console.log("Desktop nav successfully updated!");
} else {
  console.error("Desktop nav not found!");
}

// 2. Replace mobile nav links
const oldMobileNav = `              <Link href={isPinkVariant ? "/stores?theme=pink" : "/stores?theme=yellow"} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                가맹점 현황
              </Link>
              <Link href={isPinkVariant ? "/costs?theme=pink" : "/costs?theme=yellow"} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                비용 안내
              </Link>
              <Link href={isPinkVariant ? "/franchise?theme=pink" : "/franchise?theme=yellow"} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                창업 안내
              </Link>`;

const newMobileNav = `              <Link href={isYellowVariant ? "/stores?theme=yellow" : "/stores?theme=pink"} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                가맹점 현황
              </Link>
              <Link href={isYellowVariant ? "/costs?theme=yellow" : "/costs?theme=pink"} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                비용 안내
              </Link>
              <Link href={isYellowVariant ? "/franchise?theme=yellow" : "/franchise?theme=pink"} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                창업 안내
              </Link>`;

if (content.includes(oldMobileNav)) {
  content = content.replace(oldMobileNav, newMobileNav);
  console.log("Mobile nav successfully updated!");
} else {
  console.error("Mobile nav not found!");
}

fs.writeFileSync(HomeV3Path, content, 'utf8');
