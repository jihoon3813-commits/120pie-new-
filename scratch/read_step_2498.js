const fs = require('fs');

const stepFiles = [
  'franchise_from_24986ba1-c14a-4d29-8a6d-21f295b91759_step_357.json',
  'franchise_from_24986ba1-c14a-4d29-8a6d-21f295b91759_step_402.json'
];

for (const sf of stepFiles) {
  const data = JSON.parse(fs.readFileSync(`d:\\anti-gv\\25. 120pie(new)_2\\scratch\\${sf}`, 'utf8'));
  console.log(`\n=== File: ${sf} ===`);
  console.log("StartLine:", data.StartLine, "EndLine:", data.EndLine);
  if (data.ReplacementContent) {
    console.log("Length:", data.ReplacementContent.length);
    console.log("Sample:", data.ReplacementContent.substring(0, 1000));
  } else if (data.CodeContent) {
    console.log("CodeContent Length:", data.CodeContent.length);
    console.log("Sample:", data.CodeContent.substring(0, 1000));
  } else if (data.ReplacementChunks) {
    console.log("Chunks:", data.ReplacementChunks.length);
  }
}
