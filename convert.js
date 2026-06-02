const fs = require('fs');
try {
  const content = fs.readFileSync('app/admin/page.tsx', 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    if (line.includes('Order Detail Popup Modal') || line.includes('showOrderModal && selectedOrder')) {
      console.log(`Line ${lineNum}: ${line.trim()}`);
    }
  });
} catch (e) {
  console.error("Error JS:", e);
}
