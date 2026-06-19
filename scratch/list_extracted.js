const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';
const files = fs.readdirSync(scratchDir);

console.log("Extracted files list:");
for (const f of files) {
  if (f.startsWith('replacement_line_') || f.startsWith('chunks_line_') || f.startsWith('args_line_')) {
    const fullPath = path.join(scratchDir, f);
    const size = fs.statSync(fullPath).size;
    console.log(`- ${f}: ${size} bytes`);
  }
}
