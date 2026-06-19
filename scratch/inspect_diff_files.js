const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';

function inspect(file) {
  const filePath = path.join(scratchDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`${file} does not exist`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n=============================================`);
  console.log(`File: ${file} (length: ${content.length})`);
  console.log(`=============================================`);
  
  const keywords = ['올인원', '에그120', '하이브리드', '6,518', '기본 비용', '기타 비용', '5,478', '5478'];
  keywords.forEach(kw => {
    const idx = content.indexOf(kw);
    console.log(`  '${kw}' index: ${idx}`);
    if (idx !== -1) {
      console.log(`    Snippet around '${kw}':\n`, content.substring(idx - 100, idx + 400));
    }
  });
}

inspect('franchise_unstaged_diff.txt');
inspect('franchise_staged_diff.txt');
