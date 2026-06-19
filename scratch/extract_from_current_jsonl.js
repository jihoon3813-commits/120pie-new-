const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function run() {
  const jsonlPath = 'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain\\12265302-8fd4-40ae-b9b9-1462389b01d6\\.system_generated\\logs\\transcript.jsonl';
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
          if (tc.name === 'write_to_file' || tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
            const args = tc.args || {};
            let code = '';
            if (args.ReplacementContent) {
              code = args.ReplacementContent;
            } else if (args.CodeContent) {
              code = args.CodeContent;
            } else if (args.ReplacementChunks && args.ReplacementChunks[0]) {
              code = args.ReplacementChunks.map(chunk => chunk.ReplacementContent).join('\n');
            }

            if (code && (code.includes('올인원') || code.includes('하이브리드') || code.includes('기본 비용'))) {
              console.log(`Current Step ${step.step_index || stepCount}: tool call: ${tc.name}, target: ${args.TargetFile}`);
              console.log(`  Code length: ${code.length}`);
              
              let filename = `extracted_current_step_${step.step_index || stepCount}_tc_${tcIdx}.tsx`;
              fs.writeFileSync(path.join('scratch', filename), code, 'utf8');
              console.log(`  Saved to scratch/${filename}`);
            }
          }
        });
      }
    } catch (e) {
      console.error(`Error parsing line at step ${stepCount}:`, e.message);
    }
  }
}

run().catch(console.error);
