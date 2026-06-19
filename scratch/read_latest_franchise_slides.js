const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';
const files = fs.readdirSync(scratchDir);

for (const f of files) {
  if (f.startsWith('franchise_from_fcfe2e54-0c4e-4167-8fd6-d0d791b028ba_step_') && f.endsWith('.json')) {
    const filePath = path.join(scratchDir, f);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const content = data.ReplacementContent || '';
      
      let cp949Decoded = "";
      try {
        const rawBuf = fs.readFileSync(filePath);
        cp949Decoded = iconv.decode(rawBuf, 'cp949');
      } catch (e) {}

      if (content.includes("자체 금형") || cp949Decoded.includes("자체 금형")) {
        console.log(`Matched in file: ${f}`);
        console.log("UTF-8 Raw snippet (first 1000):\n", content.substring(0, 1000));
        console.log("CP949 Decoded snippet (first 1000):\n", cp949Decoded.substring(0, 1000));
      }
    } catch (e) {}
  }
}
