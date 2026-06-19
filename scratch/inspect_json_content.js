const fs = require('fs');
const path = require('path');

const filePath = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_396.json';

try {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log("JSON Length:", content.length);
  const data = JSON.parse(content);
  console.log("ReplacementContent length:", data.ReplacementContent ? data.ReplacementContent.length : 'none');
  
  if (data.ReplacementContent) {
    let rc = data.ReplacementContent;
    console.log("rc type:", typeof rc);
    if (rc.startsWith('"')) {
      rc = JSON.parse(rc);
    }
    console.log("Parsed rc length:", rc.length);
    console.log("rc content:\n", rc);
  }
} catch (e) {
  console.error(e);
}
