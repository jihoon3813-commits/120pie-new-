const fs = require('fs');
const path = require('path');

// 1. Prepare Paths
const franchise2ClientPath = path.join(__dirname, '../app/franchise2/Franchise2PageClient.tsx');
const franchiseClientPath = path.join(__dirname, '../app/franchise/FranchisePageClient.tsx');
const costsClientPath = path.join(__dirname, '../app/costs/CostsPageClient.tsx');
const storesClientPath = path.join(__dirname, '../app/stores/StoresPageClient.tsx');
const homeV3Path = path.join(__dirname, '../app/v3/HomeV3.tsx');

// Check if Franchise2PageClient exists
if (!fs.existsSync(franchise2ClientPath)) {
  console.error("Franchise2PageClient.tsx does not exist!");
  process.exit(1);
}

// 2. Read new design
let newFranchiseContent = fs.readFileSync(franchise2ClientPath, 'utf8');

// 3. Transform it to act as FranchisePageClient
// Rename Component
newFranchiseContent = newFranchiseContent.replace(/export default function Franchise2PageClient\(\)/g, 'export default function FranchisePageClient()');

// PC Header updates: remove franchise2 link, make franchise link active
const newFranchisePcHeaderTarget = `<Link href={\`/franchise?theme=\${theme}\`} className="hover:text-amber-400 transition-colors">창업 안내</Link>
            <Link href={\`/franchise2?theme=\${theme}\`} className={\`hover:scale-105 transition-transform shrink-0 \${
              isPink 
                ? "text-rose-500 hover:text-rose-600 font-extrabold" 
                : "text-[#ffd500] hover:text-[#e6bd00] font-extrabold"
            }\`}>
              창업안내(2)
            </Link>`;

const newFranchisePcHeaderReplacement = `<Link href={\`/franchise?theme=\${theme}\`} className={\`hover:scale-105 transition-transform shrink-0 \${
              isPink 
                ? "text-rose-500 hover:text-rose-600 font-extrabold" 
                : "text-[#ffd500] hover:text-[#e6bd00] font-extrabold"
            }\`}>
              창업 안내
            </Link>`;

// Mobile Drawer updates: remove franchise2 link, make franchise active, make faq col-span-2 text-center
const newFranchiseMobileDrawerTarget = `<Link href={\`/franchise?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                창업 안내
              </Link>
              <Link href={\`/franchise2?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors font-extrabold \${
                isPink 
                  ? "text-rose-500 bg-rose-500/10 border border-rose-500/20" 
                  : "text-[#ffd500] bg-[#ffd500]/10 border border-[#ffd500]/20"
              }\`}>
                창업안내(2)
              </Link>
              <Link href={\`\${backUrl}#faq\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                FAQ
              </Link>`;

const newFranchiseMobileDrawerReplacement = `<Link href={\`/franchise?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors font-extrabold \${
                isPink 
                  ? "text-rose-500 bg-rose-500/10 border border-rose-500/20" 
                  : "text-[#ffd500] bg-[#ffd500]/10 border border-[#ffd500]/20"
              }\`}>
                창업 안내
              </Link>
              <Link href={\`\${backUrl}#faq\`} onClick={() => setMobileNavOpen(false)} className={\`col-span-2 rounded-xl px-4 py-3 transition-colors text-center \${mobileNavLinkClass}\`}>
                FAQ
              </Link>`;

// Replace PC Header
if (newFranchiseContent.includes(newFranchisePcHeaderTarget)) {
  newFranchiseContent = newFranchiseContent.replace(newFranchisePcHeaderTarget, newFranchisePcHeaderReplacement);
} else {
  // LF fallback
  const lfTarget = newFranchisePcHeaderTarget.replace(/\r/g, '');
  const lfReplacement = newFranchisePcHeaderReplacement.replace(/\r/g, '');
  newFranchiseContent = newFranchiseContent.replace(lfTarget, lfReplacement);
}

// Replace Mobile Drawer
if (newFranchiseContent.includes(newFranchiseMobileDrawerTarget)) {
  newFranchiseContent = newFranchiseContent.replace(newFranchiseMobileDrawerTarget, newFranchiseMobileDrawerReplacement);
} else {
  // LF fallback
  const lfTarget = newFranchiseMobileDrawerTarget.replace(/\r/g, '');
  const lfReplacement = newFranchiseMobileDrawerReplacement.replace(/\r/g, '');
  newFranchiseContent = newFranchiseContent.replace(lfTarget, lfReplacement);
}

// Save to FranchisePageClient.tsx
fs.writeFileSync(franchiseClientPath, newFranchiseContent, 'utf8');
console.log("Successfully updated FranchisePageClient.tsx with the new design.");

// 4. Update CostsPageClient.tsx Header Navigation (revert franchise2)
let costsContent = fs.readFileSync(costsClientPath, 'utf8');
const costsPcTarget = `<Link href={\`/franchise?theme=\${theme}\`} className="hover:text-amber-400 transition-colors">창업 안내</Link>\n            <Link href={\`/franchise2?theme=\${theme}\`} className="hover:text-amber-400 transition-colors">창업안내(2)</Link>`;
const costsPcTargetCRLF = costsPcTarget.replace(/\n/g, '\r\n');
const costsPcRepl = `<Link href={\`/franchise?theme=\${theme}\`} className="hover:text-amber-400 transition-colors">창업 안내</Link>`;

costsContent = costsContent.replace(costsPcTarget, costsPcRepl).replace(costsPcTargetCRLF, costsPcRepl);

const costsMobileTarget = `<Link href={\`/franchise?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                창업 안내
              </Link>
              <Link href={\`/franchise2?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                창업안내(2)
              </Link>
              <Link href={\`\${backUrl}#faq\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                FAQ
              </Link>`;
const costsMobileRepl = `<Link href={\`/franchise?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                창업 안내
              </Link>
              <Link href={\`\${backUrl}#faq\`} onClick={() => setMobileNavOpen(false)} className={\`col-span-2 rounded-xl px-4 py-3 transition-colors text-center \${mobileNavLinkClass}\`}>
                FAQ
              </Link>`;

if (costsContent.includes(costsMobileTarget)) {
  costsContent = costsContent.replace(costsMobileTarget, costsMobileRepl);
} else {
  costsContent = costsContent.replace(costsMobileTarget.replace(/\r/g, ''), costsMobileRepl.replace(/\r/g, ''));
}
fs.writeFileSync(costsClientPath, costsContent, 'utf8');
console.log("Successfully reverted CostsPageClient.tsx navigation.");

// 5. Update StoresPageClient.tsx Header Navigation (revert franchise2)
let storesContent = fs.readFileSync(storesClientPath, 'utf8');
const storesPcTarget = `<Link href={\`/franchise?theme=\${theme}\`} className="hover:text-amber-400 transition-colors">창업 안내</Link>\n            <Link href={\`/franchise2?theme=\${theme}\`} className="hover:text-amber-400 transition-colors">창업안내(2)</Link>`;
const storesPcTargetCRLF = storesPcTarget.replace(/\n/g, '\r\n');
const storesPcRepl = `<Link href={\`/franchise?theme=\${theme}\`} className="hover:text-amber-400 transition-colors">창업 안내</Link>`;

storesContent = storesContent.replace(storesPcTarget, storesPcRepl).replace(storesPcTargetCRLF, storesPcRepl);

const storesMobileTarget = `<Link href={\`/franchise?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                창업 안내
              </Link>
              <Link href={\`/franchise2?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                창업안내(2)
              </Link>
              <Link href={\`\${backUrl}#faq\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                FAQ
              </Link>`;
const storesMobileRepl = `<Link href={\`/franchise?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                창업 안내
              </Link>
              <Link href={\`\${backUrl}#faq\`} onClick={() => setMobileNavOpen(false)} className={\`col-span-2 rounded-xl px-4 py-3 transition-colors text-center \${mobileNavLinkClass}\`}>
                FAQ
              </Link>`;

if (storesContent.includes(storesMobileTarget)) {
  storesContent = storesContent.replace(storesMobileTarget, storesMobileRepl);
} else {
  storesContent = storesContent.replace(storesMobileTarget.replace(/\r/g, ''), storesMobileRepl.replace(/\r/g, ''));
}
fs.writeFileSync(storesClientPath, storesContent, 'utf8');
console.log("Successfully reverted StoresPageClient.tsx navigation.");

// 6. Update HomeV3.tsx Header Navigation (revert franchise2)
let homeV3Content = fs.readFileSync(homeV3Path, 'utf8');

const homeV3PcTarget = `<Link href={isYellowVariant ? "/franchise?theme=yellow" : isPinkVariant ? "/franchise?theme=pink" : "/stores?theme=yellow"} className="hover:scale-105 transition-transform shrink-0">
              창업 안내
            </Link>
            <Link href={isYellowVariant ? "/franchise2?theme=yellow" : isPinkVariant ? "/franchise2?theme=pink" : "/franchise2?theme=yellow"} className="hover:scale-105 transition-transform shrink-0">
              창업안내(2)
            </Link>`;
const homeV3PcRepl = `<Link href={isYellowVariant ? "/franchise?theme=yellow" : isPinkVariant ? "/franchise?theme=pink" : "/franchise?theme=yellow"} className="hover:scale-105 transition-transform shrink-0">
              창업 안내
            </Link>`;

if (homeV3Content.includes(homeV3PcTarget)) {
  homeV3Content = homeV3Content.replace(homeV3PcTarget, homeV3PcRepl);
} else {
  homeV3Content = homeV3Content.replace(homeV3PcTarget.replace(/\r/g, ''), homeV3Repl => {
    // Wait, let's just make it simple and do string replace
    return homeV3PcRepl.replace(/\r/g, '');
  });
  // Try direct string replacement for regex/subtle mismatches
  const targetSimple = homeV3PcTarget.replace(/\r/g, '').replace(/\n/g, '').replace(/\s+/g, ' ');
  const replSimple = homeV3PcRepl.replace(/\r/g, '').replace(/\n/g, '').replace(/\s+/g, ' ');
}

// Re-read and apply precise replaces for HomeV3
const targetPcLink = `<Link href={isYellowVariant ? "/franchise2?theme=yellow" : isPinkVariant ? "/franchise2?theme=pink" : "/franchise2?theme=yellow"} className="hover:scale-105 transition-transform shrink-0">
              창업안내(2)
            </Link>`;
homeV3Content = homeV3Content.replace(targetPcLink, '').replace(targetPcLink.replace(/\r/g, ''), '');

const targetMobileLink = `<Link href={isPinkVariant ? "/franchise2?theme=pink" : "/franchise2?theme=yellow"} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
                창업안내(2)
              </Link>`;
homeV3Content = homeV3Content.replace(targetMobileLink, '').replace(targetMobileLink.replace(/\r/g, ''), '');

fs.writeFileSync(homeV3Path, homeV3Content, 'utf8');
console.log("Successfully reverted HomeV3.tsx navigation.");

// 7. Delete franchise2 directory files
const pagePath = path.join(__dirname, '../app/franchise2/page.tsx');
if (fs.existsSync(pagePath)) {
  fs.unlinkSync(pagePath);
}
if (fs.existsSync(franchise2ClientPath)) {
  fs.unlinkSync(franchise2ClientPath);
}
const franchise2Dir = path.join(__dirname, '../app/franchise2');
if (fs.existsSync(franchise2Dir)) {
  fs.rmdirSync(franchise2Dir);
  console.log("Deleted franchise2 directory.");
}
