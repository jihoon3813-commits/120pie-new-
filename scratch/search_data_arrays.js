const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';
const files = fs.readdirSync(scratchDir);

const keywords = [
  '올인원 패키지',
  '프리미엄 패키지',
  '하이브리드형 10평대',
  '가맹 계약 및 교육',
  '초도 원재료',
  '전용 베이킹 인프라'
];

files.forEach(file => {
  const filePath = path.join(scratchDir, file);
  if (!fs.statSync(filePath).isFile()) return;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const matched = keywords.filter(kw => content.includes(kw));
    if (matched.length > 0) {
      console.log(`\n=============================================`);
      console.log(`File: ${file} (matches: ${matched.join(', ')})`);
      console.log(`=============================================`);
      // Find lines that declare arrays or variables containing these keywords
      const lines = content.split('\n');
      let foundBlock = false;
      let openBrackets = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('const ') || line.includes('let ') || line.includes(' = [') || line.includes(' = {')) {
          if (keywords.some(kw => line.includes(kw)) || (i > 0 && keywords.some(kw => lines[i-1].includes(kw)))) {
            console.log(`Line ${i+1}: ${line}`);
            foundBlock = true;
          }
        }
        if (foundBlock) {
          // print next few lines
          console.log(`Line ${i+1}: ${line}`);
          if (line.includes(']')) foundBlock = false;
        }
      }
    }
  } catch (e) {
    //
  }
});
