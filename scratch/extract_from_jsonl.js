const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function run() {
  const jsonlPath = 'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain\\fcfe2e54-0c4e-4167-8fd6-d0d791b028ba\\.system_generated\\logs\\transcript.jsonl';
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
            // Look for ReplacementContent or CodeContent or ReplacementChunks
            let code = '';
            if (args.ReplacementContent) {
              code = args.ReplacementContent;
            } else if (args.CodeContent) {
              code = args.CodeContent;
            } else if (args.ReplacementChunks && args.ReplacementChunks[0]) {
              code = args.ReplacementChunks.map(chunk => chunk.ReplacementContent).join('\n');
            }

            if (code && (code.includes('올인원') || code.includes('하이브리드') || code.includes('기본 비용'))) {
              console.log(`Step ${step.step_index || stepCount}: tool call: ${tc.name}, target: ${args.TargetFile}`);
              console.log(`  Code length: ${code.length}`);
              
              // Let's identify which slide it is
              let filename = `extracted_step_${step.step_index || stepCount}_tc_${tcIdx}.tsx`;
              if (code.includes('SECTION 11') || code.includes('MODEL A')) {
                filename = `slide_11_12_recovered.tsx`;
              } else if (code.includes('SECTION 13') || code.includes('MODEL C')) {
                filename = `slide_13_recovered.tsx`;
              } else if (code.includes('SECTION 14') || code.includes('창업절차')) {
                filename = `slide_14_recovered.tsx`;
              }
              
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
