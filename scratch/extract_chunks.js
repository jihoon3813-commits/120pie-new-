const fs = require('fs');
const readline = require('readline');
const path = require('path');

async function run() {
  const jsonlPath = 'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain\\a7d16e60-6a64-43a8-9037-063c51e7a7cf\\.system_generated\\logs\\transcript.jsonl';
  const fileStream = fs.createReadStream(jsonlPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let stepCount = 0;
  for await (const line of rl) {
    stepCount++;
    try {
      const step = JSON.parse(line);
      if (step.tool_calls) {
        step.tool_calls.forEach((tc, tcIdx) => {
          if (tc.name === 'multi_replace_file_content') {
            const args = tc.args || {};
            let chunks = args.ReplacementChunks;
            if (typeof chunks === 'string') {
              try {
                chunks = JSON.parse(chunks);
              } catch(e){}
            }
            if (Array.isArray(chunks)) {
              chunks.forEach((chunk, chunkIdx) => {
                const target = chunk.TargetContent || '';
                const replacement = chunk.ReplacementContent || '';
                if (replacement.includes('올인원') || replacement.includes('하이브리드') || replacement.includes('기본 비용')) {
                  console.log(`Step ${step.step_index || stepCount} [tc ${tcIdx}] [chunk ${chunkIdx}] - TargetFile: ${args.TargetFile}`);
                  console.log(`  Length: ${replacement.length}`);
                  const filename = `chunk_step_${step.step_index || stepCount}_tc_${tcIdx}_chunk_${chunkIdx}.tsx`;
                  fs.writeFileSync(path.join('scratch', filename), replacement, 'utf8');
                  console.log(`  Saved to scratch/${filename}`);
                }
              });
            }
          }
        });
      }
    } catch (e) {
      //
    }
  }
}

run().catch(console.error);
