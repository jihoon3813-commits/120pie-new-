const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

const scratchDir = 'd:\\anti-gv\\25. 120pie(new)_2\\scratch';
const files = fs.readdirSync(scratchDir);

const keywords = [
  "올인원 패키지",
  "프리미엄 패키지",
  "What is Hybrid",
  "신규 가맹 정식 창업",
  "기본 비용",
  "기타 비용",
  "6,518"
];

for (const f of files) {
  const filePath = path.join(scratchDir, f);
  if (fs.statSync(filePath).isFile()) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Also try to decode the content using CP949 and then search
      let cp949Decoded = "";
      try {
        const rawBuf = fs.readFileSync(filePath);
        cp949Decoded = iconv.decode(rawBuf, 'cp949');
      } catch (e) {}

      for (const kw of keywords) {
        if (content.includes(kw) || cp949Decoded.includes(kw)) {
          console.log(`Matched keyword "${kw}" in file: ${f}`);
        }
      }
    } catch (e) {}
  }
}
