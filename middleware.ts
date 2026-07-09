import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";

  // 서브도메인 감지 (new.120pie.com, v6.120pie.com 또는 로컬 테스트용 new.localhost, v6.localhost)
  const isNewSubdomain = host.startsWith("new.") || host.startsWith("v6.");

  if (isNewSubdomain) {
    // 루트 경로('/')로 접근 시 내부적으로 새로 만든 v6 랜딩페이지('/landing-v6')로 포워딩(Rewrite)
    if (url.pathname === "/") {
      url.pathname = "/landing-v6";
      return NextResponse.rewrite(url);
    }
    
    // 만약 서브도메인 하위 경로(/menu, /costs 등)가 요청된다면 v6 서브페이지로 포워딩
    if (url.pathname === "/costs") {
      url.pathname = "/landing-v6/costs";
      return NextResponse.rewrite(url);
    }
    if (url.pathname === "/faq") {
      url.pathname = "/landing-v6/faq";
      return NextResponse.rewrite(url);
    }
    if (url.pathname === "/franchise") {
      url.pathname = "/landing-v6/franchise";
      return NextResponse.rewrite(url);
    }
    if (url.pathname === "/menu") {
      url.pathname = "/landing-v6/menu";
      return NextResponse.rewrite(url);
    }
    if (url.pathname === "/stores") {
      url.pathname = "/landing-v6/stores";
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * API 경로, _next 정적 자원, 외부 정적 이미지 파일 등을 제외한 모든 경로에서 실행
     */
    "/((?!api|_next/static|_next/image|assets|.*\\..*).*)",
  ],
};
