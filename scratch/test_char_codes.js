const s = "李쎌뾽紐⑤뜽";
console.log("String length:", s.length);
for (let i = 0; i < s.length; i++) {
  console.log(`char[${i}]: ${s[i]} (U+${s.charCodeAt(i).toString(16).toUpperCase()})`);
}
