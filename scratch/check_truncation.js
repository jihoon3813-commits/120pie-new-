const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';
const files = fs.readdirSync(scratchDir);

for (const file of files) {
  if (file.endsWith('.txt') || file.endsWith('.json') || file.endsWith('.tsx')) {
    const filePath = path.join(scratchDir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('truncated')) {
        console.log(`File: ${file} contains "truncated"`);
      } else {
        console.log(`File: ${file} is CLEAN (no "truncated")`);
      }
    } catch (e) {
      // ignore
    }
  }
}
