import { readFileSync } from "node:fs";
import { join } from "node:path";

export const metadata = {
  title: "120pie&coffee | 랜딩 시안 v2",
  description: "index(2).html 기반의 120pie&coffee 비교용 랜딩 페이지입니다."
};

function getLandingDraft() {
  const html = readFileSync(join(process.cwd(), "app", "landing-v2", "source.html"), "utf8");
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  return {
    css: styleMatch?.[1] ?? "",
    body: bodyMatch?.[1] ?? html
  };
}

export default function LandingV2Page() {
  const draft = getLandingDraft();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: draft.css }} />
      <div dangerouslySetInnerHTML={{ __html: draft.body }} />
    </>
  );
}
