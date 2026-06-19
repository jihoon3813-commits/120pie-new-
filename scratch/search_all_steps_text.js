const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';

const files = fs.readdirSync(scratchDir);
for (const f of files) {
  if (f.startsWith('franchise_from_') && f.endsWith('.json')) {
    const fullPath = path.join(scratchDir, f);
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('창업 모델 C') || content.includes('창업모델 C')) {
      console.log(`Found "모델 C" in ${f}`);
    }
    if (content.includes('창업 절차') || content.includes('창업절차')) {
      console.log(`Found "창업절차" in ${f}`);
    }
  }
}
