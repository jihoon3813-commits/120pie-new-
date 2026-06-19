const fs = require('fs');
const path = require('path');

const lostFoundDir = 'd:\\anti-gv\\25. 120pie(new)_2\\.git\\lost-found\\other';
const files = fs.readdirSync(lostFoundDir);

console.log(`Searching ${files.length} files in lost-found/other...`);

files.forEach(file => {
  const filePath = path.join(lostFoundDir, file);
  const buf = fs.readFileSync(filePath);
  
  // Convert buffer to UTF-8 string
  const content = buf.toString('utf8');
  
  // Check if it contains our unique target texts
  const hasSlide11 = content.includes('120겹파이 올인원 패키지');
  const hasSlide12 = content.includes('하이브리드 창업');
  const hasSlide13 = content.includes('기본 비용');
  const hasMagnifier = content.includes('isMagnifierActive');
  
  if (hasSlide11 || hasSlide12 || hasSlide13 || hasMagnifier) {
    console.log(`\n[MATCH] File: ${file} (Size: ${buf.length} bytes)`);
    console.log(`  Slide 11 (올인원): ${hasSlide11}`);
    console.log(`  Slide 12 (하이브리드): ${hasSlide12}`);
    console.log(`  Slide 13 (기본비용): ${hasSlide13}`);
    console.log(`  Magnifier code: ${hasMagnifier}`);
    
    // Check if it has any encoding issues (should print true if correct UTF-8)
    const testKorean = content.includes('돋보기') || content.includes('창업 안내');
    console.log(`  Korean decoded OK: ${testKorean}`);
    
    // Print a quick preview of lines near '120겹파이 올인원 패키지' if found
    if (hasSlide11) {
      const idx = content.indexOf('120겹파이 올인원 패키지');
      console.log(`  Preview: ${content.substring(idx - 100, idx + 200)}`);
    }
  }
});
