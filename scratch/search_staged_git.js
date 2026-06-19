const fs = require('fs');
const iconv = require('iconv-lite');

try {
  const content = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_staged_git.tsx', 'utf8');
  console.log("franchise_staged_git length:", content.length);
  
  // Try to decode CP949
  const rawBuf = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_staged_git.tsx');
  const decoded = iconv.decode(rawBuf, 'cp949');
  
  console.log("Includes 'What is Hybrid?' (decoded CP949)?", decoded.includes("What is Hybrid?"));
  console.log("Includes '신규 가맹 정식 창업' (decoded CP949)?", decoded.includes("신규 가맹 정식 창업"));
  console.log("Includes '올인원 패키지' (decoded CP949)?", decoded.includes("올인원 패키지"));
  
  // Let's print lines around Slide 11
  const lines = decoded.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('11 /') || lines[i].includes('MODEL A') || lines[i].includes('창업모델 A')) {
      console.log(`\n--- Match at Line ${i + 1} ---`);
      for (let j = Math.max(0, i - 5); j < Math.min(lines.length, i + 15); j++) {
        console.log(`${j + 1}: ${lines[j]}`);
      }
    }
  }
} catch (e) {
  console.error(e);
}
