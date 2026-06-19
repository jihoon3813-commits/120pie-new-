const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';
const filePath = path.join(scratchDir, 'diff_workdir_decoded.txt');

try {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log("Length:", content.length);
  console.log("Snippet (first 2000 chars):\n", content.substring(0, 2000));
  
  // Search for any occurrence of Section or slide
  const keywords = ['SECTION 11', 'SECTION 12', 'SECTION 13', 'SECTION 14', 'FranchisePageClient', 'CostsPageClient', 'costs'];
  keywords.forEach(kw => {
    const idx = content.indexOf(kw);
    console.log(`Keyword '${kw}' index:`, idx);
    if (idx !== -1) {
      console.log(`  Context around '${kw}':\n`, content.substring(idx - 100, idx + 400));
    }
  });
} catch (e) {
  console.error(e);
}
