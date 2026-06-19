const fs = require('fs');
const iconv = require('iconv-lite');

try {
  const content = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_staged_recovered_utf16le.tsx', 'utf8');
  console.log("Original content length:", content.length);
  
  // Encode back to cp949 (since the raw bytes were decoded as CP949 and mapped to UTF-16)
  const buf = iconv.encode(content, 'cp949');
  
  // Decode as UTF-8
  const decoded = buf.toString('utf8');
  console.log("Recovered Decoded length:", decoded.length);
  console.log("Recovered Decoded sample:\n", decoded.substring(1000, 2000));
  
  // Save to scratch/franchise_staged_recovered_fixed.tsx
  fs.writeFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_staged_recovered_fixed.tsx', decoded, 'utf8');
  console.log("Saved recovered file.");
} catch (e) {
  console.error(e);
}
