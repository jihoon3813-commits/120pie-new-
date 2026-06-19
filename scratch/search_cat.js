const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';
const files = fs.readdirSync(scratchDir);

files.forEach(file => {
  const filePath = path.join(scratchDir, file);
  if (!fs.statSync(filePath).isFile()) return;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('전용 베이킹 인프라') || content.includes('하이브리드형 10평대')) {
      console.log(`\n=============================================`);
      console.log(`File: ${file}`);
      console.log(`=============================================`);
      
      // Print the content in blocks of 200 chars around the matches
      let idx = 0;
      while ((idx = content.indexOf('전용 베이킹 인프라', idx)) !== -1) {
        console.log(`  Match at index ${idx}:\n`, content.substring(idx - 50, idx + 400));
        idx += 20;
      }
      
      idx = 0;
      while ((idx = content.indexOf('하이브리드형 10평대', idx)) !== -1) {
        console.log(`  Match at index ${idx}:\n`, content.substring(idx - 50, idx + 400));
        idx += 20;
      }
    }
  } catch (e) {
    //
  }
});
