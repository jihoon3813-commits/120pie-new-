const fs = require('fs');
const path = require('path');

const HomeV3Path = path.join(__dirname, '../app/v3/HomeV3.tsx');
let content = fs.readFileSync(HomeV3Path, 'utf8').replace(/\r\n/g, '\n');

const footerStart = content.indexOf('<footer className={`border-t transition-all duration-300 ${');
if (footerStart === -1) {
  console.error("Could not find footer start!");
  process.exit(1);
}

const footerEnd = content.indexOf('</footer>', footerStart);
if (footerEnd === -1) {
  console.error("Could not find footer end!");
  process.exit(1);
}

const fullFooterBlock = content.substring(footerStart, footerEnd + '</footer>'.length);
const replacement = `<Footer theme={isPinkVariant ? "pink" : isYellowVariant ? "yellow" : "black"} />`;

content = content.replace(fullFooterBlock, replacement);
fs.writeFileSync(HomeV3Path, content, 'utf8');
console.log("Successfully replaced footer in HomeV3.tsx!");
