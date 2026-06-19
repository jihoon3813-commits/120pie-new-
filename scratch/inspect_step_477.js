const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain\\fcfe2e54-0c4e-4167-8fd6-d0d791b028ba\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  crlfDelay: Infinity
});

let lineNum = 0;
rl.on('line', (line) => {
  lineNum++;
  try {
    const obj = JSON.parse(line);
    if (obj.step_index === 477) {
      console.log(`Line ${lineNum}: Step 477 found!`);
      if (obj.tool_calls) {
        obj.tool_calls.forEach(tc => {
          console.log(`Tool: ${tc.name}`);
          console.log(`Args keys: ${Object.keys(tc.args).join(', ')}`);
          if (tc.args.ReplacementChunks) {
            console.log(`ReplacementChunks type: ${typeof tc.args.ReplacementChunks}`);
            console.log(`ReplacementChunks is Array: ${Array.isArray(tc.args.ReplacementChunks)}`);
            const chunks = tc.args.ReplacementChunks;
            console.log(`Number of chunks: ${chunks.length}`);
            chunks.forEach((chunk, idx) => {
              console.log(`Chunk ${idx}: Start ${chunk.StartLine}, End ${chunk.EndLine}`);
              console.log(`  TargetContent length: ${chunk.TargetContent ? chunk.TargetContent.length : 0}`);
              console.log(`  ReplacementContent length: ${chunk.ReplacementContent ? chunk.ReplacementContent.length : 0}`);
              if (chunk.ReplacementContent) {
                console.log(`  ReplacementContent preview: ${chunk.ReplacementContent.substring(0, 150)}...`);
                console.log(`  Is truncated marker present: ${chunk.ReplacementContent.includes('truncated')}`);
                // Write chunk to scratch
                fs.writeFileSync(`scratch/chunks_line_${chunk.StartLine}_${idx}.json`, JSON.stringify(chunk, null, 2));
              }
            });
          }
        });
      }
    }
  } catch (err) {
    console.error("Parse error on line:", lineNum, err.message);
  }
});
