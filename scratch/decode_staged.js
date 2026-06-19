const fs = require('fs');
const iconv = require('iconv-lite');

try {
  // Read the franchise_staged_utf8.tsx file which has the mojibake
  const str = fs.readFileSync('scratch/franchise_staged_utf8.tsx', 'utf8');
  
  // Encode CP949 to get back raw bytes, then decode as UTF-8
  const buf = iconv.encode(str, 'cp949');
  const decoded = buf.toString('utf8');
  
  fs.writeFileSync('scratch/franchise_staged_decoded.tsx', decoded, 'utf8');
  console.log("Successfully decoded franchise_staged_utf8.tsx to franchise_staged_decoded.tsx");
} catch (err) {
  console.error("Error decoding:", err.message);
}
