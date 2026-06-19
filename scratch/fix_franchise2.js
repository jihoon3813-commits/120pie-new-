const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/franchise2/Franchise2PageClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Use a regular expression that is resilient to whitespace and newlines
const regex = /<Link href=\{\`\/franchise\?theme=\$\{theme\}\`\} onClick=\{\(\) => setMobileNavOpen\(false\)\} className=\{\`rounded-xl px-4 py-3 transition-colors \$\{mobileNavLinkClass\}\`\}>([\s\S]*?)<\/Link>(\s*)<Link href=\{\`\$\{backUrl\}#faq\`\} onClick=\{\(\) => setMobileNavOpen\(false\)\} className=\{\`col-span-2 rounded-xl px-4 py-3 transition-colors text-center \$\{mobileNavLinkClass\}\`\}>(\s*)FAQ(\s*)<\/Link>/;

if (regex.test(content)) {
  const match = content.match(regex);
  console.log("Matched block: ", match[0]);
  
  const replacement = `<Link href={\`/franchise?theme=\${theme}\`} onClick={() => setMobileNavOpen(false)} className={\`rounded-xl px-4 py-3 transition-colors \${mobileNavLinkClass}\`}>
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
              
  content = content.replace(regex, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Successfully replaced mobile nav using regex.");
} else {
  console.log("Regex did not match. Printing snippet around line 340-360:");
  const lines = content.split('\n');
  for (let i = 335; i <= 360; i++) {
    if (lines[i]) {
      console.log(`${i + 1}: ${JSON.stringify(lines[i])}`);
    }
  }
}
