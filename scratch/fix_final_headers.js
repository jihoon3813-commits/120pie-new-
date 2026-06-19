const fs = require('fs');
const path = require('path');

const franchiseClientPath = path.join(__dirname, '../app/franchise/FranchisePageClient.tsx');
const homeV3Path = path.join(__dirname, '../app/v3/HomeV3.tsx');

// 1. Fix FranchisePageClient.tsx PC Header
if (fs.existsSync(franchiseClientPath)) {
  let content = fs.readFileSync(franchiseClientPath, 'utf8');
  
  const regexPc = /<Link href=\{\`\/franchise\?theme=\$\{theme\}\`\} className="hover:text-amber-400 transition-colors">창업 안내<\/Link>(\s*)<Link href=\{\`\/franchise2\?theme=\$\{theme\}\`\} className=\{\`hover:scale-105 transition-transform shrink-0 \$\{[\s\S]*?<\/Link>/;
  
  if (regexPc.test(content)) {
    const replacement = `<Link href={\`/franchise?theme=\${theme}\`} className={\`hover:scale-105 transition-transform shrink-0 \${
              isPink 
                ? "text-rose-500 hover:text-rose-600 font-extrabold" 
                : "text-[#ffd500] hover:text-[#e6bd00] font-extrabold"
            }\`}>
              창업 안내
            </Link>`;
    content = content.replace(regexPc, replacement);
    fs.writeFileSync(franchiseClientPath, content, 'utf8');
    console.log("Successfully fixed FranchisePageClient.tsx PC header using regex.");
  } else {
    console.log("Could not find PC header block in FranchisePageClient.tsx using regex.");
  }
}

// 2. Fix HomeV3.tsx PC Header
if (fs.existsSync(homeV3Path)) {
  let content = fs.readFileSync(homeV3Path, 'utf8');
  
  const regexPc = /<Link href=\{isYellowVariant \? "\/franchise\?theme=yellow" : isPinkVariant \? "\/franchise\?theme=pink" : "\/franchise\?theme=yellow"\} className="hover:scale-105 transition-transform shrink-0">(\s*)창업 안내(\s*)<\/Link>(\s*)<Link href=\{isYellowVariant \? "\/franchise2\?theme=yellow" : isPinkVariant \? "\/franchise2\?theme=pink" : "\/franchise2\?theme=yellow"\} className="hover:scale-105 transition-transform shrink-0">([\s\S]*?)<\/Link>/;
  
  if (regexPc.test(content)) {
    const replacement = `<Link href={isYellowVariant ? "/franchise?theme=yellow" : isPinkVariant ? "/franchise?theme=pink" : "/franchise?theme=yellow"} className="hover:scale-105 transition-transform shrink-0">
              창업 안내
            </Link>`;
    content = content.replace(regexPc, replacement);
    fs.writeFileSync(homeV3Path, content, 'utf8');
    console.log("Successfully fixed HomeV3.tsx PC header using regex.");
  } else {
    console.log("Could not find PC header block in HomeV3.tsx using regex.");
  }
}
