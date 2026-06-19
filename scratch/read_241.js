const fs = require('fs');
const path = require('path');

const filename = 'franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_241.json';
const filepath = path.join('d:\\anti-gv\\25. 120pie(new)_2\\scratch', filename);

try {
  const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  console.log("Keys in JSON:", Object.keys(data));
  console.log("ReplacementContent length:", data.ReplacementContent ? data.ReplacementContent.length : 0);
  console.log("ReplacementContent first 500 chars:");
  console.log(data.ReplacementContent ? data.ReplacementContent.substring(0, 500) : "N/A");
  console.log("ReplacementContent last 500 chars:");
  console.log(data.ReplacementContent ? data.ReplacementContent.substring(data.ReplacementContent.length - 500) : "N/A");
  fs.writeFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\slide_13_clean_recovered.txt', data.ReplacementContent || '', 'utf8');
} catch (err) {
  console.error("Error reading JSON:", err);
}
