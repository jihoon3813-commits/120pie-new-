const fs = require('fs');
const path = require('path');

const files = [
  'section_11_from_franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_523.json_utf8.txt',
  'section_12_from_franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_229.json_utf8.txt',
  'section_13_from_franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_241.json_utf8.txt'
];

for (const f of files) {
  const fullPath = path.join('d:\\anti-gv\\25. 120pie(new)_2\\scratch', f);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    console.log(`\n================ ${f} (length: ${content.length}) ================`);
    console.log(content);
  } else {
    console.log(`File not found: ${f}`);
  }
}
