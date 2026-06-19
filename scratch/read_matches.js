const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';
const files = fs.readdirSync(scratchDir);

for (const file of files) {
  if (file.startsWith('transcript_match_') && file.endsWith('_utf8.txt')) {
    const filePath = path.join(scratchDir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      console.log(`\n================ ${file} (lines: ${lines.length}) ================`);
      // Print first 5 lines
      for (let i = 0; i < 5 && i < lines.length; i++) {
        console.log(`  ${lines[i].trim()}`);
      }
    } catch (e) {
      console.error(e);
    }
  }
}
