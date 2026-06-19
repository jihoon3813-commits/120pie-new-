const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';
const files = fs.readdirSync(scratchDir);

for (const file of files) {
  if (file.endsWith('.json')) {
    const filePath = path.join(scratchDir, file);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`\n================ FILE: ${file} ================`);
      console.log("Keys:", Object.keys(data));
      if (data.TargetFile) console.log("TargetFile:", data.TargetFile);
      if (data.Description) console.log("Description:", data.Description.substring(0, 100));
      if (data.ReplacementContent) {
        console.log("ReplacementContent length:", data.ReplacementContent.length);
        console.log("Snippet:", data.ReplacementContent.substring(0, 300));
      }
      if (data.ReplacementChunks) {
        console.log("ReplacementChunks count:", data.ReplacementChunks.length);
        data.ReplacementChunks.forEach((chunk, index) => {
          console.log(`  Chunk ${index+1}: lines ${chunk.StartLine}-${chunk.EndLine}, TargetContent length: ${chunk.TargetContent.length}, ReplacementContent length: ${chunk.ReplacementContent.length}`);
          console.log(`  Snippet:`, chunk.ReplacementContent.substring(0, 150));
        });
      }
    } catch (e) {
      console.error("Error reading", file, e.message);
    }
  }
}
