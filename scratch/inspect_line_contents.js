const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';
const files = fs.readdirSync(scratchDir);

for (const f of files) {
  if (f.startsWith('replacement_line_') && f.endsWith('.txt')) {
    const fullPath = path.join(scratchDir, f);
    const content = fs.readFileSync(fullPath, 'utf8');
    console.log(`\n================ ${f} (length: ${content.length}) ================`);
    console.log(content.substring(0, 400));
  }
}
