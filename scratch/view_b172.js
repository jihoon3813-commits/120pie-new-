const fs = require('fs');

try {
  const content = fs.readFileSync('C:\\Users\\FORYOUCOM\\.gemini\\antigravity-ide\\brain\\b172261a-5680-47a4-bcfa-060e04ee7a9a\\.system_generated\\logs\\overview.txt', 'utf8');
  console.log("File length:", content.length);
  
  // Let's find "올인원" in it
  let idx = -1;
  let pos = 0;
  while ((idx = content.indexOf("올인원", pos)) !== -1) {
    console.log("Found '올인원' at index:", idx);
    console.log("Context around '올인원':\n", content.substring(Math.max(0, idx - 100), Math.min(content.length, idx + 400)));
    console.log("\n-------------------\n");
    pos = idx + 1;
  }
} catch (e) {
  console.error(e);
}
