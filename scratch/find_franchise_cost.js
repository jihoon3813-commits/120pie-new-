const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';

const files = fs.readdirSync(scratchDir);
for (const f of files) {
  if (f.startsWith('franchise_from_') && f.endsWith('.json')) {
    const fullPath = path.join(scratchDir, f);
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('6,518')) {
      console.log(`Found "6,518" in ${f}`);
    }
  }
}
