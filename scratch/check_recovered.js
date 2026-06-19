const fs = require('fs');

try {
  const content = fs.readFileSync('d:\\anti-gv\\25. 120pie(new)_2\\scratch\\franchise_recovered.tsx', 'utf8');
  console.log("recovered file length:", content.length);
  
  // Search for "창업 모델 A" or "에그120 프리미엄 패키지"
  console.log("Includes '에그120 프리미엄 패키지'?", content.includes("에그120 프리미엄 패키지"));
  console.log("Includes 'What is Hybrid?'?", content.includes("What is Hybrid?"));
  console.log("Includes '신규 가맹 정식 창업'?", content.includes("신규 가맹 정식 창업"));
} catch (err) {
  console.error("Error:", err);
}
