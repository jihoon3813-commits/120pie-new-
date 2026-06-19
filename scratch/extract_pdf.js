const fs = require('fs');
const { PDFParse } = require('pdf-parse');
const buf = fs.readFileSync('d:/anti-gv/25. 120pie(new)_2/hoon/260611_120pie-가맹-제안_막장있음_수정.pdf');
const parser = new PDFParse(buf);
parser.getText().then(result => {
  console.log('Pages:', result.total);
  result.pages.forEach(p => {
    console.log(`\n--- PAGE ${p.num} ---`);
    console.log(p.text);
  });
}).catch(e => console.error('Error:', e.message));
