const fs = require('fs');
const data = JSON.parse(fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_404.json', 'utf8'));
console.log("StartLine:", data.StartLine, "EndLine:", data.EndLine);
console.log("ReplacementContent length:", data.ReplacementContent.length);
fs.writeFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\step_404_content.txt', data.ReplacementContent);
console.log("Saved content to step_404_content.txt");
