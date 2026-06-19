const fs = require('fs');

const content = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\section_11_from_franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_396.json.txt', 'utf8');

console.log("Length:", content.length);
// Check if it contains SECTION 11, 12, 13, 14
console.log("Contains SECTION 11:", content.includes('SECTION 11.'));
console.log("Contains SECTION 12:", content.includes('SECTION 12.'));
console.log("Contains SECTION 13:", content.includes('SECTION 13.'));
console.log("Contains SECTION 14:", content.includes('SECTION 14.'));

// Save first 1000 characters
console.log("\nSample (first 1000):\n", content.substring(0, 1000));
// Save last 1000 characters
console.log("\nSample (last 1000):\n", content.substring(content.length - 1000));
