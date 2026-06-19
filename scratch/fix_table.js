const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../app/franchise/FranchisePageClient.tsx');
let content = fs.readFileSync(targetFile, 'utf8');

// Find the start of the broken block
const pattern = '<tr className={`';
let startIdx = -1;
let currentPos = 0;

while ((currentPos = content.indexOf(pattern, currentPos)) !== -1) {
  // Check if it's the one in Slide 10
  const snippet = content.substring(currentPos, currentPos + 200);
  if (snippet.includes('isPink ? "bg-rose-500/10') && snippet.includes('font-black`}>') && content.substring(currentPos + 100, currentPos + 500).includes('최종 도입 금액')) {
    startIdx = currentPos;
    break;
  }
  currentPos += 1;
}

if (startIdx === -1) {
  console.error("Error: Could not find the start string in the file!");
  process.exit(1);
}

console.log("Found start of target at index:", startIdx);

// Find the closing section tag of Slide 10
const endStr = '<span>Slide 11 / 16</span>\r\n          </div>\r\n        </section>';
const endStrLF = '<span>Slide 11 / 16</span>\n          </div>\n        </section>';
let endIdx = content.indexOf(endStr, startIdx);
let endLen = endStr.length;

if (endIdx === -1) {
  endIdx = content.indexOf(endStrLF, startIdx);
  endLen = endStrLF.length;
}

if (endIdx === -1) {
  console.error("Error: Could not find the end string in the file!");
  process.exit(1);
}

console.log("Found end of target at index:", endIdx, "with length:", endLen);

// Read the replacement block from replacement.txt
const replacement = fs.readFileSync(path.join(__dirname, 'replacement.txt'), 'utf8');

// Insert replacement
const newContent = content.substring(0, startIdx) + replacement + content.substring(endIdx + endLen);

// Write back
fs.writeFileSync(targetFile, newContent, 'utf8');
console.log("Successfully replaced broken code!");
