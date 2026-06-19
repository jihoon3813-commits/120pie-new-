const fs = require('fs');
const content = fs.readFileSync('d:/anti-gv/25. 120pie(new)_2/app/franchise/FranchisePageClient.tsx', 'utf8');
console.log("File length:", content.length);
console.log("Contains '440':", content.includes('440'));
console.log("Contains '330':", content.includes('330'));
console.log("Contains '690':", content.includes('690'));
console.log("Contains '3,000':", content.includes('3,000') || content.includes('3000'));
console.log("Contains '6,518':", content.includes('6,518') || content.includes('6518'));
// Find some numbers in the file
const matches = content.match(/\d+,\d+/g) || [];
console.log("Matches of comma-separated numbers (first 10):", matches.slice(0, 10));
