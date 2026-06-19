const fs = require('fs');
const path = require('path');

const filename = 'franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_396.json';
const filepath = path.join('d:\\anti-gv\\25. 120pie(new)_2\\scratch', filename);

try {
  const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  console.log("Keys in JSON:", Object.keys(data));
  console.log("ReplacementContent sample:");
  console.log(data.ReplacementContent ? data.ReplacementContent.substring(0, 1000) : "N/A");
} catch (err) {
  console.error("Error reading JSON:", err);
}
