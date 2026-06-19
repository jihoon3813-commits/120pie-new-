const fs = require('fs');
const path = require('path');

const mappings = JSON.parse(fs.readFileSync(path.join(__dirname, 'image_mappings.json'), 'utf-8'));

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
      if (/\.(tsx|ts|js|json|css)$/.test(file) && !file.endsWith('image_mappings.json') && !file.endsWith('search_results.json') && file !== 'read_excel.js' && file !== 'dry_run_results.json') {
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

// Extract public ID from Cloudinary URL
function getPublicId(url) {
  if (!url || !url.includes('res.cloudinary.com')) return null;
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;
  const pathPart = parts[1];
  const segments = pathPart.split('/');
  const lastSegment = segments[segments.length - 1];
  const dotIndex = lastSegment.lastIndexOf('.');
  const name = dotIndex === -1 ? lastSegment : lastSegment.substring(0, dotIndex);
  try {
    return decodeURIComponent(name);
  } catch (e) {
    return name;
  }
}

// Prepare URL-to-URL mappings
const urlReplacements = [];
const descriptionReplacements = [];

for (const m of mappings) {
  const existing = m["기존"];
  const replacement = m["변경"];
  
  if (existing.startsWith('http://') || existing.startsWith('https://')) {
    const publicId = getPublicId(existing);
    urlReplacements.push({
      existing,
      replacement,
      publicId
    });
  } else {
    descriptionReplacements.push({
      description: existing,
      replacement
    });
  }
}

console.log(`Prepared ${urlReplacements.length} URL-based rules and ${descriptionReplacements.length} description-based rules.`);

const changes = [];

// Helper to decode line for descriptive checks
function safeDecode(str) {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    return str;
  }
}

for (const filePath of allFiles) {
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);
  let content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const fileChanges = [];

  const replacedLines = new Set();

  // 1. Process description-based replacements first
  lines.forEach((line, lineIdx) => {
    const decodedLine = safeDecode(line);

    for (const rule of descriptionReplacements) {
      const desc = rule.description;
      
      if (desc === "로고" && decodedLine.includes('logo_120pie_coffee')) {
        const logoRegex = /https:\/\/res\.cloudinary\.com\/[^\s'"`]+/g;
        const match = logoRegex.exec(line);
        if (match) {
          const url = match[0].replace(/[);,]+$/, '');
          if ((url.includes('logo_120pie_coffee_nu') || url.includes('logo_120pie_coffee_nu2')) && url !== rule.replacement) {
            fileChanges.push({
              line: lineIdx + 1,
              type: 'description-logo',
              find: url,
              replace: rule.replacement
            });
            replacedLines.add(lineIdx);
            line = lines[lineIdx];
          }
        }
      } else if (desc === "히어로섹션 영상" && (decodedLine.includes('120pie_영상_7_xoo7il') || decodedLine.includes('120pie_영상_2_lnnpbh') || decodedLine.includes('120pie_영상_6_qlxvav'))) {
        const videoRegex = /https:\/\/res\.cloudinary\.com\/[^\s'"`]+/g;
        const match = videoRegex.exec(line);
        if (match) {
          const url = match[0].replace(/[);,]+$/, '');
          if (url !== rule.replacement) {
            fileChanges.push({
              line: lineIdx + 1,
              type: 'description-hero-video',
              find: url,
              replace: rule.replacement
            });
            replacedLines.add(lineIdx);
            line = lines[lineIdx];
          }
        }
      } else if (desc === "커피와 잘 어울리는 세트 메뉴로 한 잔의 만족을 더합니다 > 영상" && (decodedLine.includes('120pie_영상_3_exaslh') || decodedLine.includes('120pie_영상_3_ylbwog'))) {
        const videoRegex = /https:\/\/res\.cloudinary\.com\/[^\s'"`]+/g;
        const match = videoRegex.exec(line);
        if (match) {
          const url = match[0].replace(/[);,]+$/, '');
          if (url !== rule.replacement) {
            fileChanges.push({
              line: lineIdx + 1,
              type: 'description-set-video',
              find: url,
              replace: rule.replacement
            });
            replacedLines.add(lineIdx);
            line = lines[lineIdx];
          }
        }
      } else if (desc === "지금 매장의 아름다운 분위기 그대로 시작하는 샵인샵 > 이미지" && decodedLine.includes('120겹파이_크림치즈_애플_블루베리_연출')) {
        const imgRegex = /https:\/\/res\.cloudinary\.com\/[^\s'"`]+/g;
        const match = imgRegex.exec(line);
        if (match) {
          const url = match[0].replace(/[);,]+$/, '');
          if (url !== rule.replacement) {
            fileChanges.push({
              line: lineIdx + 1,
              type: 'description-shopinshop-img',
              find: url,
              replace: rule.replacement
            });
            replacedLines.add(lineIdx);
            line = lines[lineIdx];
          }
        }
      } else if (desc === "누구나 3분이면 완벽한 맛을 재현하는 초간편 시스템 > 이미지" && decodedLine.includes('120겹파이_연출4_du1czf')) {
        const imgRegex = /https:\/\/res\.cloudinary\.com\/[^\s'"`]+/g;
        const match = imgRegex.exec(line);
        if (match) {
          const url = match[0].replace(/[);,]+$/, '');
          if (url !== rule.replacement) {
            fileChanges.push({
              line: lineIdx + 1,
              type: 'description-easycook-img',
              find: url,
              replace: rule.replacement
            });
            replacedLines.add(lineIdx);
            line = lines[lineIdx];
          }
        }
      } else if (desc === "하루 백 잔을 팔아도 제자리걸음이라면,\r\n문제는 잔수가 아닌 낮은 객단가입니다. > 영상" && decodedLine.includes('120pie_영상_2_2_qz3xdx')) {
        const videoRegex = /https:\/\/res\.cloudinary\.com\/[^\s'"`]+/g;
        const match = videoRegex.exec(line);
        if (match) {
          const url = match[0].replace(/[);,]+$/, '');
          if (url !== rule.replacement) {
            fileChanges.push({
              line: lineIdx + 1,
              type: 'description-lowprofit-video',
              find: url,
              replace: rule.replacement
            });
            replacedLines.add(lineIdx);
            line = lines[lineIdx];
          }
        }
      }
      
      // Process menu items
      if (desc.startsWith('메뉴 이미지_')) {
        const menuName = desc.replace('메뉴 이미지_', '').trim();
        const cleanName = menuName.replace(/\s+/g, '');
        const cleanLine = decodedLine.replace(/\s+/g, '');
        
        if (cleanLine.includes(`name:"${cleanName}"`) || cleanLine.includes(`name:'${cleanName}'`) || 
            (cleanName === '애플파이' && cleanLine.includes('name:"애플시나몬파이"')) ||
            (cleanName === '콘버터계란빵' && cleanLine.includes('name:"콘치즈계란빵"')) ||
            (cleanName === '로제미트파이' && cleanLine.includes('name:"수제고기파이"')) ||
            (cleanName === '애플파이' && cleanLine.includes('name:"달콤애플파이"')) ||
            (cleanName === '오리지널계란빵' && cleanLine.includes('name:"쌀반죽오리지널에그빵"')) ||
            (cleanName === '베이컨계란빵' && cleanLine.includes('name:"베이컨치즈에그빵"')) ||
            (cleanName === '오리지널츄러스' && cleanLine.includes('name:"에어프라이고품질츄러스"')) ||
            (cleanName === '직화불고기핫도그' && cleanLine.includes('name:"직화불고기핫도그"'))
        ) {
          const imgRegex = /img:\s*["'](https?:\/\/[^\s'"`]+)["']/g;
          const srcRegex = /src:\s*["'](https?:\/\/[^\s'"`]+)["']/g;
          let imgMatch = imgRegex.exec(line) || srcRegex.exec(line);
          
          if (imgMatch && imgMatch[1] !== rule.replacement) {
            fileChanges.push({
              line: lineIdx + 1,
              type: 'menu-item-img',
              find: imgMatch[1],
              replace: rule.replacement,
              menu: menuName
            });
            replacedLines.add(lineIdx);
            line = lines[lineIdx];
          }
        }
      }
    }
  });

  // 2. Process URL-based replacements
  lines.forEach((line, lineIdx) => {
    if (replacedLines.has(lineIdx)) return;

    // Check for exact match first
    for (const rule of urlReplacements) {
      if (line.includes(rule.existing) && rule.existing !== rule.replacement) {
        fileChanges.push({
          line: lineIdx + 1,
          type: 'exact-url',
          find: rule.existing,
          replace: rule.replacement
        });
        replacedLines.add(lineIdx);
        line = lines[lineIdx];
      }
    }
    
    // Check for public ID match if not already replaced
    if (!replacedLines.has(lineIdx)) {
      const urlRegex = /https:\/\/res\.cloudinary\.com\/[^\s'"`]+/g;
      let match;
      while ((match = urlRegex.exec(line)) !== null) {
        const foundUrl = match[0].replace(/\\/g, '').replace(/[);,]+$/, '');
        const foundPublicId = getPublicId(foundUrl);
        
        if (foundPublicId) {
          const matchedRule = urlReplacements.find(r => r.publicId && r.publicId === foundPublicId);
          if (matchedRule && foundUrl !== matchedRule.replacement) {
            fileChanges.push({
              line: lineIdx + 1,
              type: 'public-id-url',
              find: foundUrl,
              replace: matchedRule.replacement
            });
            replacedLines.add(lineIdx);
            break;
          }
        }
      }
    }
  });

  if (fileChanges.length > 0) {
    changes.push({
      file: relativePath,
      fileChanges
    });
  }
}

fs.writeFileSync(path.join(__dirname, 'dry_run_results.json'), JSON.stringify(changes, null, 2), 'utf-8');

console.log(`\nVerification dry run completed!`);
console.log(`Total files requiring actual changes: ${changes.length}`);
changes.forEach(c => {
  console.log(`- File: ${c.file} | Changes remaining: ${c.fileChanges.length}`);
});

let summaryText = '--- DETAILED REPLACEMENT DRY RUN SUMMARY ---\n\n';
changes.forEach(c => {
  summaryText += `FILE: ${c.file}\n`;
  c.fileChanges.forEach(ch => {
    summaryText += `  Line ${ch.line} (${ch.type}${ch.menu ? ' for ' + ch.menu : ''}):\n`;
    summaryText += `    FIND   : ${ch.find}\n`;
    summaryText += `    REPLACE: ${ch.replace}\n\n`;
  });
  summaryText += '='.repeat(80) + '\n\n';
});

fs.writeFileSync(path.join(__dirname, 'dry_run_summary.txt'), summaryText, 'utf-8');
