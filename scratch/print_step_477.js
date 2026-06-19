const fs = require('fs');

const logPath = 'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain\\fcfe2e54-0c4e-4167-8fd6-d0d791b028ba\\.system_generated\\logs\\transcript.jsonl';
const rl = require('readline').createInterface({
  input: fs.createReadStream(logPath),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  if (line.includes('"step_index":477')) {
    console.log("Found step 477!");
    try {
      const obj = JSON.parse(line);
      const tc = obj.tool_calls[0];
      let chunks = tc.args.ReplacementChunks;
      if (typeof chunks === 'string') {
        chunks = JSON.parse(chunks);
      }
      console.log("Chunks count:", chunks.length);
      chunks.forEach((c, idx) => {
        console.log(`Chunk ${idx}: StartLine: ${c.StartLine}, EndLine: ${c.EndLine}`);
        console.log(`  TargetContent length: ${c.TargetContent?.length}`);
        console.log(`  ReplacementContent length: ${c.ReplacementContent?.length}`);
        if (c.ReplacementContent.includes('truncated')) {
          console.log(`  WARNING: Chunk ${idx} contains "truncated"!`);
        } else {
          console.log(`  Chunk ${idx} is clean!`);
        }
        // Write to file
        fs.writeFileSync(`d:\\anti-gv\\25. 120pie(new)_2\\scratch\\chunk_477_${idx}.tsx`, c.ReplacementContent, 'utf8');
      });
    } catch (e) {
      console.error(e);
    }
  }
});
