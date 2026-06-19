const iconv = require('iconv-lite');

const strings = [
  "李쎌뾽 紐⑤뜽 C.",
  "?占쎄퇋 媛€占??占쎌떇 李쎌뾽",
  "#?占쎄퇋 李쎌뾽??以€鍮꾪븯???占쎈퉬 ?占쎌＜??",
  "#?占?諛곕떖 ?占쎌떆 ?占쎌쁺???占쎈쭩?占쎈뒗 ?占쎌＜??",
  "湲곕낯 鍮꾩슜",
  "湲곤옙? 鍮꾩슜",
  "媛€留밸퉬",
  "珥덈룄 臾쇳뭹占?",
  "怨꾩빟 ?占쏀 蹂댁쬆占?",
  "濡쒖뿴??",
  "?占쏀뀒由ъ뼱 / ?占쎌꽕",
  "二쇰갑 / 二쇰갑 吏묎린占?",
  "媛꾪뙋",
  "湲곤옙?",
  "120寃뱁뙆??釉Layout",
  "120寃뱁뙆??釉뚮옖?占쎌뿉 ?占???占쎄 ???占쎌젏 ?占쎌占? 援먯쑁 占?媛쒖젏 吏€????",
  "?占쏙옙??占쎌옱, ?占쎈땲?? 硫붾돱?? 諛곕꼫, ?占쎌닔占? ?占쏀듃吏€ 占?媛곸쥌 ?占쎈낫占?",
  "蹂댁쬆占?",
  "留뚭린 諛섑솚",
  "濡쒖뿴??",
  "?占쎌쫵 留덌옙???媛곸쥌 ?占쏀??占쎈낫占?",
  "占쎈㈇",
  "占쎈ぉ",
  "蹂꾨룄",
  "120寃뱁뙆",
  "紐⑷났, ?占쎄린, ?占쎌옣, 議곕챸, ?占?? 誘몄옣, ?占쎄퀎 占?媛먮━",
  "?占쏀겕?占? ?占쎌뒪?占쎌꽌, ?占쎈튃占? ?占쎈엻???占쎌옣占? 而ㅽ뵾癒몄떊",
  "?占쎈㈃ ?占쎌텧 ?占쎌 ",
  "?占쎌옣 ?占쏀솴???占쎈씪 ?占쎌씠??",
  "?占쎌삤?占쏀겕, ?占쎌뒪 二쇰갑 愿€?? ?占쏀긽??",
  "120pie & coffee 媛€占?李쎌뾽 ?占쎌븞??"
];

strings.forEach(s => {
  // Let's decode using two methods
  let res1 = "";
  try {
    const buf = iconv.encode(s, 'cp949');
    res1 = buf.toString('utf8');
  } catch (e) {
    res1 = "error: " + e.message;
  }
  
  // Method 2: raw characters to bytes, then UTF-8
  let res2 = "";
  try {
    const bytes = [];
    for (let i = 0; i < s.length; i++) {
      bytes.push(s.charCodeAt(i) & 0xff);
    }
    res2 = Buffer.from(bytes).toString('utf-8');
  } catch (e) {
    res2 = "error: " + e.message;
  }

  console.log(`Original: "${s}"`);
  console.log(`  Method 1 (CP949->UTF8): "${res1}"`);
  console.log(`  Method 2 (Latin1->UTF8): "${res2}"`);
});
