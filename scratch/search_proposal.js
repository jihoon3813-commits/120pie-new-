const fs = require('fs');

const files = [
  'd:\\anti-gv\\25. 120pie(new)_2\\app\\proposal\\page.tsx',
  'd:\\anti-gv\\25. 120pie(new)_2\\app\\proposal2\\page.tsx'
];

for (const f of files) {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    console.log(`Checking ${f}...`);
    console.log("  Contains '6,518':", content.includes('6,518') || content.includes('6518'));
    console.log("  Contains '창업모델 A':", content.includes('창업모델 A') || content.includes('창업 모델 A'));
    console.log("  Contains '올인원 패키지':", content.includes('올인원 패키지'));
    console.log("  Contains '5-STEP LAUNCH ROADMAP':", content.includes('5-STEP LAUNCH ROADMAP') || content.includes('Franchise Process'));
  }
}
