const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';
const cleanJsonFiles = [
  'transcript_tool_190_0.json',
  'transcript_tool_244_0.json',
  'transcript_tool_381_0.json',
  'transcript_tool_427_0.json',
  'transcript_tool_481_0.json',
  'transcript_tool_518_0.json',
  'transcript_tool_526_0.json',
  'transcript_tool_530_0.json'
];

for (const file of cleanJsonFiles) {
  const filePath = path.join(scratchDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File ${file} does not exist.`);
    continue;
  }
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`\n================ FILE: ${file} ================`);
    console.log("Tool name:", data.name);
    if (data.args) {
      console.log("Arg keys:", Object.keys(data.args));
      if (data.args.TargetFile) console.log("TargetFile:", data.args.TargetFile);
      if (data.args.Description) console.log("Description:", data.args.Description);
      if (data.args.StartLine) console.log("StartLine:", data.args.StartLine, "EndLine:", data.args.EndLine);
      
      // Let's write the ReplacementContent to a txt file in scratch for inspection
      if (data.args.ReplacementContent) {
        const outName = file.replace('.json', '_content.txt');
        const outPath = path.join(scratchDir, outName);
        fs.writeFileSync(outPath, data.args.ReplacementContent, 'utf8');
        console.log(`Wrote ReplacementContent (${data.args.ReplacementContent.length} chars) to ${outName}`);
      }
      
      if (data.args.ReplacementChunks) {
        console.log("ReplacementChunks count:", data.args.ReplacementChunks.length);
        data.args.ReplacementChunks.forEach((chunk, index) => {
          const chunkOutName = file.replace('.json', `_chunk_${index+1}.txt`);
          const chunkOutPath = path.join(scratchDir, chunkOutName);
          fs.writeFileSync(chunkOutPath, chunk.ReplacementContent, 'utf8');
          console.log(`Wrote Chunk ${index+1} (${chunk.ReplacementContent.length} chars, lines ${chunk.StartLine}-${chunk.EndLine}) to ${chunkOutName}`);
        });
      }
    }
  } catch (e) {
    console.error("Error reading", file, e.message);
  }
}
