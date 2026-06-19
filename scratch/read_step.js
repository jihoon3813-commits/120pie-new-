const fs = require('fs');

const files = [
  'transcript_tool_512_0.json',
  'transcript_tool_518_0.json'
];

files.forEach(f => {
  try {
    const data = JSON.parse(fs.readFileSync(`d:\\anti-gv\\25. 120pie(new)_2\\scratch\\${f}`, 'utf8'));
    console.log(`\n================= ${f} =================`);
    const args = data.args || {};
    console.log("Args Keys:", Object.keys(args));
    console.log("Description:", args.Description);
    console.log("Instruction:", args.Instruction);
    const content = args.ReplacementContent || '';
    console.log("ReplacementContent Length:", content.length);
    if (content.length > 0) {
      console.log("First 300 chars of ReplacementContent:\n", content.substring(0, 300));
      console.log("Last 300 chars of ReplacementContent:\n", content.substring(content.length - 300));
    }
  } catch (e) {
    console.error(`Error reading ${f}:`, e.message);
  }
});
