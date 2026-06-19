const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';
const files = fs.readdirSync(scratchDir);

const keywords = ['올인원', '에그120', '하이브리드', '6,518', '6518', '기본 비용', '기타 비용', '5,478', '5478'];

files.forEach(file => {
  const filePath = path.join(scratchDir, file);
  if (!fs.statSync(filePath).isFile()) return;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const matched = keywords.filter(kw => content.includes(kw));
    if (matched.length > 0) {
      console.log(`File: ${file} matches: ${matched.join(', ')}`);
      // Print first match line
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const hasKw = keywords.some(kw => line.includes(kw));
        if (hasKw) {
          console.log(`  Line ${i+1}: ${line.trim().substring(0, 100)}`);
          break; // just show first one
        }
      }
    }
  } catch (e) {
    //
  }
});
