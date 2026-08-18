import { NextRequest, NextResponse } from "next/server";

const KAKAO_KEY = process.env.KAKAO_REST_API_KEY || "82b7d82dc6c6778e0ff608ef18b13b09";

interface KakaoDoc {
  id: string;
  place_name: string;
  category_name: string;
  category_group_code: string;
  phone: string;
  address_name: string;
  road_address_name: string;
  x: string; // lng
  y: string; // lat
  place_url: string;
}

// 주소에서 시/도, 구/군, 동 파싱
function parseAddress(addr: string) {
  const parts = addr.trim().split(" ");
  const sido = parts[0] || "서울특별시";
  const sigungu = parts[1] || "";
  const dong = parts.find((p) => p.endsWith("동") || p.endsWith("읍") || p.endsWith("면") || p.endsWith("가")) || parts[2] || "";
  return { sido, sigungu, dong };
}

// 카테고리 매핑
function mapCategory(catName: string, queryCat: string): string {
  if (catName.includes("PC방")) return "PC방";
  if (catName.includes("만화")) return "만화카페";
  if (catName.includes("보드")) return "보드게임카페";
  if (catName.includes("스터디")) return "스터디카페";
  if (catName.includes("키즈")) return "키즈카페";
  if (catName.includes("파티룸") || catName.includes("룸카페")) return "멀티방/파티룸";
  if (queryCat && queryCat !== "전체") return queryCat;
  return "카페/디저트";
}

async function fetchKakaoCategory(center: { lat: number; lng: number }, groupCode: string, radiusMeters: number, page: number): Promise<KakaoDoc[]> {
  try {
    const url = `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=${groupCode}&x=${center.lng}&y=${center.lat}&radius=${radiusMeters}&size=15&page=${page}`;
    const res = await fetch(url, {
      headers: { Authorization: `KakaoAK ${KAKAO_KEY}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.documents || [];
  } catch {
    return [];
  }
}

async function fetchKakaoKeyword(center: { lat: number; lng: number }, query: string, radiusMeters: number, page: number): Promise<KakaoDoc[]> {
  try {
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&x=${center.lng}&y=${center.lat}&radius=${radiusMeters}&size=15&page=${page}`;
    const res = await fetch(url, {
      headers: { Authorization: `KakaoAK ${KAKAO_KEY}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.documents || [];
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      bounds, // { sw: { lat, lng }, ne: { lat, lng } }
      center = { lat: 37.4981, lng: 127.0283 },
      categories = ["카페/디저트"],
      radius = 500,
    } = await req.json();

    const cLat = center.lat || 37.4981;
    const cLng = center.lng || 127.0283;

    // 화면 영역 (Bounding Box)
    const swLat = bounds?.sw?.lat !== undefined ? bounds.sw.lat : cLat - 0.004;
    const swLng = bounds?.sw?.lng !== undefined ? bounds.sw.lng : cLng - 0.005;
    const neLat = bounds?.ne?.lat !== undefined ? bounds.ne.lat : cLat + 0.004;
    const neLng = bounds?.ne?.lng !== undefined ? bounds.ne.lng : cLng + 0.005;

    const fetchTasks: Promise<KakaoDoc[]>[] = [];

    // 1) 카페/디저트 카테고리 검색
    if (categories.includes("카페/디저트") || categories.includes("전체")) {
      fetchTasks.push(fetchKakaoCategory({ lat: cLat, lng: cLng }, "CE7", radius, 1));
      fetchTasks.push(fetchKakaoCategory({ lat: cLat, lng: cLng }, "CE7", radius, 2));
      fetchTasks.push(fetchKakaoKeyword({ lat: cLat, lng: cLng }, "카페", radius, 1));
      fetchTasks.push(fetchKakaoKeyword({ lat: cLat, lng: cLng }, "카페", radius, 2));
      fetchTasks.push(fetchKakaoKeyword({ lat: cLat, lng: cLng }, "디저트", radius, 1));
      fetchTasks.push(fetchKakaoKeyword({ lat: cLat, lng: cLng }, "베이커리", radius, 1));
      fetchTasks.push(fetchKakaoKeyword({ lat: cLat, lng: cLng }, "스타벅스", radius, 1));
      fetchTasks.push(fetchKakaoKeyword({ lat: cLat, lng: cLng }, "투썸플레이스", radius, 1));
      fetchTasks.push(fetchKakaoKeyword({ lat: cLat, lng: cLng }, "커피빈", radius, 1));
      fetchTasks.push(fetchKakaoKeyword({ lat: cLat, lng: cLng }, "소과당", radius, 1));
    }

    // 2) 선택된 개별 타겟 업종 키워드 검색
    if (categories.includes("PC방")) {
      fetchTasks.push(fetchKakaoKeyword({ lat: cLat, lng: cLng }, "PC방", radius, 1));
      fetchTasks.push(fetchKakaoKeyword({ lat: cLat, lng: cLng }, "PC카페", radius, 1));
    }
    if (categories.includes("만화카페")) {
      fetchTasks.push(fetchKakaoKeyword({ lat: cLat, lng: cLng }, "만화카페", radius, 1));
    }
    if (categories.includes("스터디카페")) {
      fetchTasks.push(fetchKakaoKeyword({ lat: cLat, lng: cLng }, "스터디카페", radius, 1));
    }
    if (categories.includes("키즈카페")) {
      fetchTasks.push(fetchKakaoKeyword({ lat: cLat, lng: cLng }, "키즈카페", radius, 1));
    }
    if (categories.includes("보드게임카페")) {
      fetchTasks.push(fetchKakaoKeyword({ lat: cLat, lng: cLng }, "보드게임카페", radius, 1));
    }
    if (categories.includes("멀티방/파티룸")) {
      fetchTasks.push(fetchKakaoKeyword({ lat: cLat, lng: cLng }, "파티룸", radius, 1));
      fetchTasks.push(fetchKakaoKeyword({ lat: cLat, lng: cLng }, "룸카페", radius, 1));
    }

    const responses = await Promise.all(fetchTasks);
    const allDocs = responses.flat();

    const seenIds = new Set<string>();
    const seenNames = new Set<string>();
    const results: any[] = [];

    // 제외할 순수 음식점/주점 카테고리
    const excludeCategories = [
      "음식점 > 한식",
      "음식점 > 일식",
      "음식점 > 중식",
      "음식점 > 양식",
      "음식점 > 술집",
      "음식점 > 치킨",
      "음식점 > 분식",
      "음식점 > 육류,고기",
      "음식점 > 해물,생선",
    ];

    for (const doc of allDocs) {
      if (!doc || !doc.place_name || !doc.x || !doc.y) continue;
      if (seenIds.has(doc.id) || seenNames.has(doc.place_name)) continue;

      const catName = doc.category_name || "";
      const isExcluded = excludeCategories.some((ex) => catName.startsWith(ex)) &&
        !catName.includes("카페") && !catName.includes("디저트") && !catName.includes("베이커리");

      if (isExcluded) continue;

      const lat = parseFloat(parseFloat(doc.y).toFixed(6));
      const lng = parseFloat(parseFloat(doc.x).toFixed(6));

      // 엄격한 화면 영역(Bounding Box) 필터: 화면 밖 매장 제외
      if (lat < swLat - 0.001 || lat > neLat + 0.001 || lng < swLng - 0.001 || lng > neLng + 0.001) {
        continue;
      }

      seenIds.add(doc.id);
      seenNames.add(doc.place_name);

      const rawAddr = doc.road_address_name || doc.address_name || "";
      const { sido, sigungu, dong } = parseAddress(rawAddr);

      const matchedCategory = mapCategory(doc.category_name, categories[0] || "카페/디저트");

      results.push({
        name: doc.place_name,
        category: matchedCategory,
        sido,
        sigungu,
        dong,
        roadAddress: doc.road_address_name || doc.address_name || "주소 미등록",
        lat,
        lng,
        phone: doc.phone || undefined,
        homepage: `https://map.naver.com/p/search/${encodeURIComponent(doc.place_name)}`,
        status: "영업가능",
        isContracted: false,
        memo: `실시간 발굴 매장 (${doc.category_name || matchedCategory})`,
      });
    }

    return NextResponse.json({
      success: true,
      targets: results,
      count: results.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
