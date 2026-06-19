const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';
const files = fs.readdirSync(scratchDir);

const keywords = ["6,518", "6518", "올인원", "올인원 패키지", "5-STEP", "5단계", "5단계 로드맵", "1,040", "1040", "5,478", "5478"];

console.log("Searching in", scratchDir);

for (const file of files) {
  if (file.endsWith('.json') || file.endsWith('.txt') || file.endsWith('.tsx') || file.endsWith('.js')) {
    const filePath = path.join(scratchDir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      for (const kw of keywords) {
        if (content.includes(kw)) {
          console.log(`File: ${file} matches "${kw}"`);
        }
      }
    } catch (e) {
      // ignore read errors
    }
  }
}
