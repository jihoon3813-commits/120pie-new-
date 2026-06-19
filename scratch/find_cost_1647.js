const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';

const files = fs.readdirSync(scratchDir);
for (const f of files) {
  if (f.startsWith('franchise_from_1647bb98-e70e-4b1d-a2d0-31aa2fe410c5') && f.endsWith('.json')) {
    const fullPath = path.join(scratchDir, f);
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('6,518') || content.includes('6518') || content.includes('창업 모델 C')) {
      console.log(`Found "6,518/모델 C" in ${f}`);
    }
  }
}
