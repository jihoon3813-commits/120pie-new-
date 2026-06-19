const fs = require('fs');
const path = require('path');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';
const files = fs.readdirSync(scratchDir);

files.forEach(file => {
  if (!file.endsWith('.json')) return;
  const filePath = path.join(scratchDir, file);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    
    // Check if it is a tool call or direct arguments
    let args = data.args || data;
    if (args.ReplacementContent || args.ReplacementChunks) {
      console.log(`\n=============================================`);
      console.log(`File: ${file} (size: ${raw.length})`);
      console.log(`  Description: ${args.Description || 'none'}`);
      console.log(`  StartLine: ${args.StartLine || 'none'}, EndLine: ${args.EndLine || 'none'}`);
      
      const rc = args.ReplacementContent || (args.ReplacementChunks?.[0]?.ReplacementContent) || '';
      console.log(`  Content Length: ${rc.length}`);
      const isTruncated = rc.includes('truncated') || raw.includes('truncated');
      console.log(`  Is Truncated: ${isTruncated}`);
      
      if (!isTruncated && rc.length > 50) {
        console.log(`  Snippet:\n`, rc.substring(0, 300));
        console.log(`  ...\n`, rc.substring(rc.length - 300));
      }
    }
  } catch (e) {
    // console.log(`Error reading ${file}:`, e.message);
  }
});
