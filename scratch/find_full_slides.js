const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';
const files = fs.readdirSync(scratchDir);

files.forEach(file => {
  if (!file.endsWith('.json')) return;
  const filePath = path.join(scratchDir, file);
  
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    
    // Check various properties that could contain the code
    let codeStr = '';
    if (data.ReplacementContent) {
      codeStr = data.ReplacementContent;
    } else if (data.ReplacementChunks && data.ReplacementChunks[0]) {
      codeStr = data.ReplacementChunks[0].ReplacementContent;
    } else if (data.CodeContent) {
      codeStr = data.CodeContent;
    } else if (data.Arguments) {
      const args = data.Arguments;
      codeStr = args.ReplacementContent || args.ReplacementChunks?.[0]?.ReplacementContent || args.CodeContent || '';
    }
    
    if (codeStr && typeof codeStr === 'string') {
      const hasS11 = codeStr.includes('SECTION 11');
      const hasS12 = codeStr.includes('SECTION 12');
      const hasS13 = codeStr.includes('SECTION 13');
      const hasS14 = codeStr.includes('SECTION 14');
      
      console.log(`File: ${file} (length: ${codeStr.length}) -> S11: ${hasS11}, S12: ${hasS12}, S13: ${hasS13}, S14: ${hasS14}`);
      
      if (hasS11 || hasS12 || hasS13 || hasS14) {
        // We found a file containing some slides
        // Let's write the unescaped code to a .tsx file to check it
        let cleanCode = codeStr;
        if (cleanCode.startsWith('"')) {
          try {
            cleanCode = JSON.parse(cleanCode);
          } catch(e){}
        }
        cleanCode = cleanCode.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"');
        fs.writeFileSync(path.join(scratchDir, `extracted_from_${file.replace('.json', '')}.tsx`), cleanCode, 'utf8');
        console.log(`  Wrote to extracted_from_${file.replace('.json', '')}.tsx (length: ${cleanCode.length})`);
      }
    }
  } catch (e) {
    // console.log(`Error processing ${file}: ${e.message}`);
  }
});
