const fs = require('fs');
const filePath = 'd:/anti-gv/25. 120pie(new)_2/app/franchise2/Franchise2PageClient.tsx';
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(
  '㈜일이공에프앤비 | 대표이사: 홍길동 | 서울특별시 강남구 역삼로 120, 5층',
  '㈜고우웰라이프 | 대표이사: 이사근 | 경기도 의왕시 오봉산단1로 12, 에이스하이테크비전21, 203호'
);

code = code.replace(
  '가맹문의: 1566-0000 | 이메일: support@120pie.com | 사업자등록번호: 000-00-00000',
  '가맹문의: 1566-3594 | 이메일: reconisg@naver.com | 사업자등록번호: 000-00-00000'
);

fs.writeFileSync(filePath, code, 'utf8');
console.log("Footer info updated successfully!");
