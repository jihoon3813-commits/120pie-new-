const fs = require('fs');

try {
  const buf = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_staged.tsx');
  console.log("Raw buffer length:", buf.length);
  
  // Let's decode with euc-kr
  const decoder = new TextDecoder('euc-kr');
  const decoded = decoder.decode(buf);
  console.log("EUC-KR Decoded length:", decoded.length);
  console.log("EUC-KR Decoded sample:\n", decoded.substring(0, 1000));
  
  // Save to franchise_staged_recovered_euckr.tsx
  fs.writeFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_staged_recovered_euckr.tsx', decoded, 'utf8');
  console.log("Saved euc-kr decoded file.");
} catch (err) {
  console.error("Error:", err);
}
