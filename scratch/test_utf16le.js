const fs = require('fs');

try {
  const buf = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_staged.tsx');
  console.log("Raw buffer length:", buf.length);
  
  // Let's decode with utf-16le
  const decoded = buf.toString('utf16le');
  console.log("UTF-16LE Decoded length:", decoded.length);
  console.log("UTF-16LE Decoded sample:\n", decoded.substring(0, 1000));
  
  // Save to franchise_staged_recovered_utf16le.tsx
  fs.writeFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_staged_recovered_utf16le.tsx', decoded, 'utf8');
  console.log("Saved utf-16le decoded file.");
} catch (err) {
  console.error("Error:", err);
}
