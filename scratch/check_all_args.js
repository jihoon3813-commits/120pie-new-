const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';
const files = fs.readdirSync(scratchDir);

files.forEach(file => {
  if (!file.endsWith('.json') && !file.endsWith('.txt')) return;
  const filePath = path.join(scratchDir, file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('올인원 패키지')) {
      console.log(`File: ${file} (length: ${content.length})`);
      if (content.includes('truncated')) {
        console.log(`  -> Truncated!`);
      } else {
        console.log(`  -> CLEAN (NOT TRUNCATED)!`);
        // Print first 500 chars and last 500 chars
        console.log(`  Snippet:\n`, content.substring(0, 500));
      }
    }
  } catch (e) {}
});
