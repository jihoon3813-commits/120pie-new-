const fs = require('fs');
const path = require('path');

function extractUrlsAndContext(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const results = [];
  
  // Regex to find Cloudinary URLs
  const urlRegex = /https:\/\/res\.cloudinary\.com\/[^\s'"`]+/g;
  
  lines.forEach((line, index) => {
    let match;
    while ((match = urlRegex.exec(line)) !== null) {
      const url = match[0].replace(/\\/g, ''); // clean escape chars if any
      // Get context around the line
      const start = Math.max(0, index - 2);
      const end = Math.min(lines.length - 1, index + 2);
      const context = lines.slice(start, end + 1).join('\n');
      
      results.push({
        file: path.basename(filePath),
        line: index + 1,
        url: url,
        context: context
      });
    }
  });
  
  return results;
}

const v3Results = extractUrlsAndContext(path.join(__dirname, '../app/v3/HomeV3.tsx'));
const hoonResults = extractUrlsAndContext(path.join(__dirname, '../hoon/HomeV3.tsx'));

const allResults = [...v3Results, ...hoonResults];

fs.writeFileSync(path.join(__dirname, 'extracted_urls.json'), JSON.stringify(allResults, null, 2), 'utf-8');

console.log(`Extracted ${v3Results.length} URLs from app/v3/HomeV3.tsx`);
console.log(`Extracted ${hoonResults.length} URLs from hoon/HomeV3.tsx`);
