const fs = require('fs');
const path = require('path');

const targetDirs = [
  path.join(__dirname, '../app'),
  path.join(__dirname, '../components'),
  path.join(__dirname, '../hoon')
];

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        getFiles(filePath, files);
      }
    } else {
      if (/\.(tsx|ts|js|json)$/.test(file)) {
        files.push(filePath);
      }
    }
  }
  return files;
}

const allFiles = [];
for (const dir of targetDirs) {
  if (fs.existsSync(dir)) {
    getFiles(dir, allFiles);
  }
}

const keywords = [
  "로제미트", "블루베리", "콘치즈", "커스터드", "불고기", "애플", "팥치즈", "크림치즈", 
  "망고", "페퍼로니", "고구마", "꿀호떡", "불닭", "오리지널", "베이컨", "통모짜", "슈크림", "팥",
  "녹차", "슈가", "오레오", "짜장", "핫도그"
];

const results = {};

for (const filePath of allFiles) {
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const matches = [];
  for (const keyword of keywords) {
    if (content.includes(keyword)) {
      matches.push(keyword);
    }
  }
  
  if (matches.length > 0) {
    results[relativePath] = matches;
  }
}

console.log(JSON.stringify(results, null, 2));
