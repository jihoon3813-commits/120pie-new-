const fs = require('fs');
const data = JSON.parse(fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_943.json', 'utf8'));
console.log("Type:", data.name);
console.log("Keys:", Object.keys(data));
console.log("TargetFile:", data.TargetFile);
console.log("StartLine:", data.StartLine, "EndLine:", data.EndLine);
if (data.ReplacementContent) {
  console.log("ReplacementContent length:", data.ReplacementContent.length);
  console.log("Sample:\n", data.ReplacementContent.substring(0, 1500));
} else if (data.CodeContent) {
  console.log("CodeContent length:", data.CodeContent.length);
  console.log("Sample:\n", data.CodeContent.substring(0, 1500));
} else if (data.ReplacementChunks) {
  console.log("Chunks count:", data.ReplacementChunks.length);
}
