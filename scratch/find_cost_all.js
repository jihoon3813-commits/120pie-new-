const fs = require('fs');
const content = fs.readFileSync('d:/anti-gv/25. 120pie(new)_2/app/proposal2/page.tsx', 'utf8');

// Find all matches for numbers followed by "만원" or "만 원"
const regex = /\d+[\s]*[만]?[\s]*원/g;
const matches = content.match(regex) || [];
console.log("Found cost matches:", matches);

// Also let's print lines containing "모델" or "비용" or "패키지"
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('모델') || line.includes('패키지') || line.includes('비용') || line.includes('순수익')) {
    console.log(`L${idx+1}: ${line.trim()}`);
  }
});
