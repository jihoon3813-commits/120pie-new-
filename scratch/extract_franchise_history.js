const fs = require('fs');
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
          const args = tc.args || {};
          const target = args.TargetFile || args.AbsolutePath || '';
          if (target.includes('FranchisePageClient.tsx')) {
            console.log(`Step ${step.step_index || stepCount}: tool call: ${tc.name}, method: ${tc.name}`);
            let code = args.ReplacementContent || args.CodeContent || '';
            if (args.ReplacementChunks && args.ReplacementChunks[0]) {
              code = args.ReplacementChunks.map(chunk => chunk.ReplacementContent).join('\n');
            }
            console.log(`  Length: ${code.length}`);
            if (code) {
              console.log(`  Preview: ${JSON.stringify(code.substring(0, 150))}`);
            }
          }
        });
      }
    } catch(e){}
  }
}

run().catch(console.error);
