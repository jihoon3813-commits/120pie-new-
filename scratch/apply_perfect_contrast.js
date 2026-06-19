const fs = require('fs');

const filepath = "d:\\anti-gv\\25. 120pie(new)_2\\app\\franchise\\FranchisePageClient.tsx";
let content = fs.readFileSync(filepath, 'utf8');

// 줄바꿈과 공백에 상관없이 치환하기 위해 normalize하는 함수
function flexReplace(source, targetText, replacementText) {
    // 혹시 모르니 단순 replace 시도
    if (source.includes(targetText)) {
        return source.replace(targetText, replacementText);
    }
    
    // 만약 단순 포함이 안 되면 줄바꿈을 \n으로 변환하여 시도
    const sourceLF = source.replace(/\r\n/g, '\n');
    const targetLF = targetText.replace(/\r\n/g, '\n');
    if (sourceLF.includes(targetLF)) {
        return sourceLF.replace(targetLF, replacementText).replace(/\n/g, '\r\n');
    }
    
    console.log("Warning: flexReplace target not found! Target:\n", targetText.substring(0, 80));
    return source;
}

// 1. SECTION 10 테이블 헤더 교체
const s10_th_target = `<tr className={\`border-b border-neutral-200/20 text-[10px] \${isPink ? "text-neutral-400" : "text-neutral-500"}\`}>
                          <th className="py-2 px-1 text-left w-[25%]">구분</th>
                          <th className="py-2 px-1 text-right w-[20%]">비율 (%)</th>
                          <th className="py-2 px-1 text-right w-[25%]">예상 금액</th>
                          <th className="py-2 px-1 text-left w-[30%] pl-4">비고</th>
                        </tr>`;

const s10_th_repl = `<tr className="border-b border-neutral-200/20 text-[10px]">
                          <th className={\`py-2 px-1 text-left w-[25%] \${isPink ? "!text-neutral-200" : "!text-[#0d233a]"}\`}>구분</th>
                          <th className={\`py-2 px-1 text-right w-[20%] \${isPink ? "!text-neutral-200" : "!text-[#0d233a]"}\`}>비율 (%)</th>
                          <th className={\`py-2 px-1 text-right w-[25%] \${isPink ? "!text-neutral-200" : "!text-[#0d233a]"}\`}>예상 금액</th>
                          <th className={\`py-2 px-1 text-left w-[30%] pl-4 \${isPink ? "!text-neutral-200" : "!text-[#0d233a]"}\`}>비고</th>
                        </tr>`;

content = flexReplace(content, s10_th_target, s10_th_repl);

// opacity-80 제거 및 note 색상 강제 지정
const s10_td_target = `<td className={\`py-3 px-2 text-left pl-4 opacity-80 \${row.highlight ? "!text-white" : (isPink ? "!text-neutral-300" : "!text-[#576575]")}\`}>{row.note}</td>`;
const s10_td_repl = `<td className={\`py-3 px-2 text-left pl-4 \${row.highlight ? "!text-white" : (isPink ? "!text-neutral-200" : "!text-[#576575]")}\`}>{row.note}</td>`;

content = flexReplace(content, s10_td_target, s10_td_repl);

// 2. SECTION 11 올인원 패키지 th 교체
const s11_th_target = `<tr className={\`border-b border-neutral-200/20 text-[10px] \${isPink ? "text-neutral-400" : "text-neutral-500"}\`}>
                          <th className="py-2 px-1 text-left w-[25%]">구분</th>
                          <th className="py-2 px-1 text-left w-[45%]">세부 내용</th>
                          <th className="py-2 px-1 text-left w-[30%]">비고</th>
                        </tr>`;

const s11_th_repl = `<tr className="border-b border-neutral-200/20 text-[10px]">
                          <th className={\`py-2 px-1 text-left w-[25%] \${isPink ? "!text-neutral-200" : "!text-[#0d233a]"}\`}>구분</th>
                          <th className={\`py-2 px-1 text-left w-[45%] \${isPink ? "!text-neutral-200" : "!text-[#0d233a]"}\`}>세부 내용</th>
                          <th className={\`py-2 px-1 text-left w-[30%] \${isPink ? "!text-neutral-200" : "!text-[#0d233a]"}\`}>비고</th>
                        </tr>`;

content = flexReplace(content, s11_th_target, s11_th_repl);

// SECTION 11 td note 부분
const s11_td_target = `<td className={\`py-2.5 px-1 text-[10px] \${isPink ? "!text-neutral-400" : "!text-[#8a98a5]"}\`}>{row.note}</td>`;
const s11_td_repl = `<td className={\`py-2.5 px-1 text-[10px] \${isPink ? "!text-neutral-200" : "!text-[#576575]"}\`}>{row.note}</td>`;

content = flexReplace(content, s11_td_target, s11_td_repl);

// 3. SECTION 12 th 교체
const s12_th_target = `<tr className={\`border-b border-neutral-200/20 text-[10px] sm:text-xs \${isPink ? "text-neutral-400" : "text-neutral-500"}\`}>
                      <th className="py-2 px-1 text-left w-[20%]">구분</th>
                      <th className="py-2 px-1 text-left w-[50%]">세부 내용</th>
                      <th className="py-2 px-1 text-right w-[15%]">금액</th>
                      <th className="py-2 px-1 text-left w-[15%] pl-4">비고</th>
                    </tr>`;

const s12_th_repl = `<tr className="border-b border-neutral-200/20 text-[10px] sm:text-xs">
                      <th className={\`py-2 px-1 text-left w-[20%] \${isPink ? "!text-neutral-200" : "!text-[#0d233a]"}\`}>구분</th>
                      <th className={\`py-2 px-1 text-left w-[50%] \${isPink ? "!text-neutral-200" : "!text-[#0d233a]"}\`}>세부 내용</th>
                      <th className={\`py-2 px-1 text-right w-[15%] \${isPink ? "!text-neutral-200" : "!text-[#0d233a]"}\`}>금액</th>
                      <th className={\`py-2 px-1 text-left w-[15%] pl-4 \${isPink ? "!text-neutral-200" : "!text-[#0d233a]"}\`}>비고</th>
                    </tr>`;

content = flexReplace(content, s12_th_target, s12_th_repl);

// SECTION 12 td note 부분
const s12_td_target = `<td className={\`py-3 px-1 text-[10px] pl-4 \${isPink ? "!text-neutral-400" : "!text-[#8a98a5]"}\`}>{row.note}</td>`;
const s12_td_repl = `<td className={\`py-3 px-1 text-[10px] pl-4 \${isPink ? "!text-neutral-200" : "!text-[#576575]"}\`}>{row.note}</td>`;

content = flexReplace(content, s12_td_target, s12_td_repl);

// 4. SECTION 13 th 교체 (2개 모두 있으므로 flexReplace를 반복적으로 적용해야 함)
const s13_th_target = `<tr className={\`border-b border-neutral-200/20 text-[10px] \${isPink ? "text-neutral-400" : "text-neutral-500"}\`}>
                        <th className="py-2 px-1 text-left w-[25%]">구분</th>
                        <th className="py-2 px-1 text-left w-[45%]">세부 내용</th>
                        <th className="py-2 px-1 text-right w-[15%]">금액</th>
                        <th className="py-2 px-1 text-left w-[15%] pl-4">비고</th>
                      </tr>`;

const s13_th_repl = `<tr className="border-b border-neutral-200/20 text-[10px]">
                        <th className={\`py-2 px-1 text-left w-[25%] \${isPink ? "!text-neutral-200" : "!text-[#0d233a]"}\`}>구분</th>
                        <th className={\`py-2 px-1 text-left w-[45%] \${isPink ? "!text-neutral-200" : "!text-[#0d233a]"}\`}>세부 내용</th>
                        <th className={\`py-2 px-1 text-right w-[15%] \${isPink ? "!text-neutral-200" : "!text-[#0d233a]"}\`}>금액</th>
                        <th className={\`py-2 px-1 text-left w-[15%] pl-4 \${isPink ? "!text-neutral-200" : "!text-[#0d233a]"}\`}>비고</th>
                      </tr>`;

content = flexReplace(content, s13_th_target, s13_th_repl);
// 두 번째 th 교체
content = flexReplace(content, s13_th_target, s13_th_repl);

// SECTION 13 td note 부분 (2개 모두 있으므로 반복 적용)
const s13_td_target = `<td className={\`py-3 px-1 text-[10px] pl-4 \${isPink ? "!text-neutral-400" : "!text-[#8a98a5]"}\`}>{row.note}</td>`;
const s13_td_repl = `<td className={\`py-3 px-1 text-[10px] pl-4 \${isPink ? "!text-neutral-200" : "!text-[#576575]"}\`}>{row.note}</td>`;

content = flexReplace(content, s13_td_target, s13_td_repl);
content = flexReplace(content, s13_td_target, s13_td_repl);

fs.writeFileSync(filepath, content, 'utf8');
console.log("Done applying perfect high contrast styles.");
