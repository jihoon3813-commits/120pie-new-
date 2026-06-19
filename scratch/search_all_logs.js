const fs = require('fs');
const path = require('path');
const readline = require('readline');

const brainDir = 'C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain';
const targetFileSubstring = 'franchisepageclient';

async function searchLog(logPath, convId) {
  if (!fs.existsSync(logPath)) return;
  
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let writes = [];

  for await (const line of rl) {
    try {
      const entry = JSON.parse(line);
      if (entry.tool_calls) {
        for (const call of entry.tool_calls) {
          if (call.name === 'write_to_file' || call.name === 'replace_file_content' || call.name === 'multi_replace_file_content') {
            const args = call.args || {};
            const target = args.TargetFile || '';
            if (target.toLowerCase().includes(targetFileSubstring)) {
              writes.push({
                step: entry.step_index,
                type: call.name,
                args: args,
                timestamp: entry.created_at
              });
            }
          }
        }
      }
    } catch (e) {}
  }

  if (writes.length > 0) {
    console.log(`\n=== Found ${writes.length} edits in Conversation ${convId} ===`);
    for (let w of writes) {
      console.log(`Step ${w.step} [${w.timestamp}] - ${w.type}`);
      const outPath = `d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_from_${convId}_step_${w.step}.json`;
      fs.writeFileSync(outPath, JSON.stringify(w.args, null, 2));
      console.log(`  Saved edit payload to ${outPath}`);
    }
  }
}

async function main() {
  const dirs = fs.readdirSync(brainDir);
  for (const dir of dirs) {
    const logPath = path.join(brainDir, dir, '.system_generated', 'logs', 'transcript.jsonl');
    await searchLog(logPath, dir);
  }
  console.log("\nDone scanning all conversation logs.");
}

main();
