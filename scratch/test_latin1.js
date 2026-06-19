const iconv = require('iconv-lite');

const s = "湲곗〈 移댄럹 ?듭씤???꾩엯 (A 留ㅼ옣)";

// Let's print char codes of s
for (let i = 0; i < s.length; i++) {
  console.log(`${s[i]}: U+${s.charCodeAt(i).toString(16).toUpperCase()}`);
}

// Let's try to convert each char to bytes using cp949 and print as hex
try {
  const bufCp949 = iconv.encode(s, 'cp949');
  console.log("CP949 bytes:", bufCp949.toString('hex'));
  console.log("CP949 bytes as UTF-8 string:", bufCp949.toString('utf8'));
} catch (e) {
  console.log("CP949 encode error:", e.message);
}

// Let's try encoding as utf-8 and decoding as cp949
try {
  const bufUtf8 = Buffer.from(s, 'utf8');
  console.log("UTF-8 bytes:", bufUtf8.toString('hex'));
  console.log("UTF-8 bytes decoded as CP949:", iconv.decode(bufUtf8, 'cp949'));
} catch (e) {
  console.log("UTF-8 encode/decode error:", e.message);
}
