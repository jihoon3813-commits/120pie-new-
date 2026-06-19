const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';

const files = fs.readdirSync(scratchDir);
for (const f of files) {
  if (f.startsWith('franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba') && f.endsWith('.json')) {
    const fullPath = path.join(scratchDir, f);
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('창업 모델 A') || content.includes('창업 모델 B') || content.includes('모델 A') || content.includes('모델 B')) {
      console.log(`Found "모델 A/B" in ${f}`);
    }
  }
}
