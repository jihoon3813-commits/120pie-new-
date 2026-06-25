export interface MenuItem {
  name: string;
  desc: string;
  img: string;
  badge?: string;
  tag?: string;
}

export interface MenuCategory {
  id: string;
  label: string;
  title: string;
  desc: string;
  items: MenuItem[];
}

export const MENU_DATA: Record<string, MenuCategory> = {
  "120겹파이": {
    id: "120겹파이",
    label: "120겹파이",
    title: "커피와 함께 즐기기 좋은 대표 메뉴, 120파이",
    desc: "고소한 크림 파이부터 든든한 미트와 피자 파이까지, 손님의 취향과 시간대에 맞춰 폭넓게 제안할 수 있는 120파이 메뉴입니다.",
    items: [
      { name: "애플파이", desc: "달콤한 사과 풍미로 따뜻한 커피와 편안하게 곁들이기 좋습니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782397524/1._%EC%95%A0%ED%94%8C%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_n8szil.png", badge: "ORIGINAL", tag: "HIT" },
      { name: "커스터드 파이", desc: "부드럽고 달콤한 커스터드 크림을 채운 클래식 디저트 파이입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782397524/2._%EC%BB%A4%EC%8A%A4%ED%84%B0%EB%93%9C%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_s6r8bh.png", badge: "ORIGINAL" },
      { name: "크림치즈 파이", desc: "산뜻한 크림치즈의 부드러움을 바삭한 결 사이에 담았습니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782397524/3._%ED%81%AC%EB%A6%BC%EC%B9%98%EC%A6%88%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_ktmh4z.png", badge: "ORIGINAL", tag: "추천" },
      { name: "고구마 파이", desc: "달콤하고 포근한 고구마 맛으로 남녀노소 편하게 즐길 수 있습니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782397524/4._%EA%B3%A0%EA%B5%AC%EB%A7%88%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_rjtwp5.png", badge: "ORIGINAL" },
      { name: "블루베리 파이", desc: "상큼한 블루베리 풍미가 바삭한 파이와 어울리는 달콤한 디저트입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782397525/5._%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_hg03x0.png", badge: "ORIGINAL" },
      { name: "망고 파이", desc: "달콤하고 향긋한 망고의 풍미가 돋보이는 산뜻한 디저트입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782397524/6._%EB%A7%9D%EA%B3%A0%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_ms7oev.png", badge: "ORIGINAL" },
      { name: "팥치즈 파이", desc: "달콤한 팥과 담백한 치즈가 만나 익숙하면서도 새로운 맛을 전합니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782397523/7._%ED%8C%A5%EC%B9%98%EC%A6%88%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_itmqgw.png", badge: "ORIGINAL" },
      { name: "콘치즈 파이", desc: "고소한 옥수수와 치즈의 조합으로 누구나 편하게 즐기기 좋은 메뉴입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782397523/8._%EC%BD%98%EC%B9%98%EC%A6%88%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_u37u1i.png", badge: "ORIGINAL" },
      { name: "꿀호떡 파이", desc: "달콤한 꿀 and 향긋한 계피향, 고소한 땅콩이 만나 호떡의 정취를 더한 달콤한 파이입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782397523/9._%EA%BF%80%ED%98%B8%EB%96%A1%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_mscin2.png", badge: "ORIGINAL", tag: "NEW" },
      { name: "불고기 파이", desc: "달큰한 불고기 풍미를 담아 간단한 한 끼로도 든든한 메뉴입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782397524/10._%EB%B6%88%EA%B3%A0%EA%B8%B0%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_x3jigh.png", badge: "MEAT", tag: "HIT" },
      { name: "불닭 파이", desc: "매콤하고 중독성 있는 불닭 소스와 고소한 치즈가 조화를 이룬 파이입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782397524/11._%EB%B6%88%EB%8B%AD%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_ji4ju9.png", badge: "MEAT" },
      { name: "함박치즈 파이", desc: "육즙이 풍부한 함박 스테이크와 치즈가 만나 든든한 식사가 되는 파이입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782397525/12._%ED%95%A8%EB%B0%95%EC%B9%98%EC%A6%88%ED%8C%8C%EC%9D%B4_e7nbbg.png", badge: "MEAT" },
      { name: "로제미트 파이", desc: "부드러운 로제 소스와 든든한 미트가 어우러진 식사형 파이입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782397525/13._%EB%A1%9C%EC%A0%9C%EB%AF%B8%ED%8A%B8%ED%8C%8C%EC%9D%B4_%EB%88%84%EB%81%BC__260131_xbyshr.png", badge: "MEAT", tag: "추천" },
      { name: "페페로니 피자파이", desc: "페페로니와 치즈의 익숙한 풍미로 간식과 식사 모두 잘 어울립니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782397526/14._%ED%8E%98%ED%8D%BC%EB%A1%9C%EB%8B%88%ED%94%BC%EC%9E%90%ED%8C%8C%EC%9D%B4_ajaxxz.png", badge: "PIZZA", tag: "NEW" },
      { name: "불고기 피자파이", desc: "달콤 짭조름한 불고기와 토마토 피자 소스가 조화를 이루는 피자 파이입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782397527/15._%EB%B6%88%EA%B3%A0%EA%B8%B0%ED%94%BC%EC%9E%90%ED%8C%8C%EC%9D%B4_abbiac.png", badge: "PIZZA", tag: "추천" },
      { name: "고구마베이컨 피자파이", desc: "달콤한 고구마 무스와 짭조름한 베이컨이 올라간 단짠 정석의 피자파이입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782397527/16._%EA%B3%A0%EA%B5%AC%EB%A7%88%EB%B2%A0%EC%9D%B4%EC%BB%A8%ED%94%BC%EC%9E%90%ED%8C%8C%EC%9D%B4_xavfmd.png", badge: "PIZZA" },
      { name: "포테이토베이컨 피자파이", desc: "담백하고 포근한 포테이토와 짭조름한 베이컨이 풍부한 치즈와 조화를 이룹니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782397527/17._%ED%8F%AC%ED%85%8C%EC%9D%B4%ED%86%A0%EB%B2%A0%EC%9D%B4%EC%BB%A8%ED%94%BC%EC%9E%90_gnszt0.png", badge: "PIZZA", tag: "HIT" }
    ]
  },
  "에그120": {
    id: "에그120",
    label: "에그120 계란빵",
    title: "폭신하고 부드러운 간식, 에그120 계란빵",
    desc: "폭신한 계란빵에 고소한 계란과 다채로운 토핑을 더했습니다. 커피와 함께 가볍게 즐기기 좋은, 따뜻하고 친근한 간식 메뉴입니다.",
    items: [
      { name: "오리지널 계란빵", desc: "추억 속 계란빵의 따뜻한 맛을 요즘 감성으로 담아낸 시그니처 메뉴입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184985/edited-photo_4_y98ytv.jpg", badge: "대표" },
      { name: "베이컨 계란빵", desc: "짭짤하고 고소한 베이컨과 담백한 계란이 잘 어우러지는 든든한 메뉴입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184987/edited-photo_2_rplfpn.jpg", badge: "추천" },
      { name: "콘버터 계란빵", desc: "달콤한 옥수수와 고소한 버터가 더해져 풍성하게 즐길 수 있습니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184986/edited-photo_6_mkz6ey.jpg", badge: "인기" },
      { name: "통모짜 계란빵", desc: "쭉 늘어나는 모짜렐라 치즈가 더해져 고소하고 짭짤하게 즐길 수 있습니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184989/edited-photo_7_usuk8g.jpg", badge: "치즈가득" },
      { name: "로제미트 계란빵", desc: "부드러운 로제소스와 계란의 조합으로 진하고 크리미한 풍미를 전합니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184991/edited-photo_1_euib8f.jpg" },
      { name: "커스터드 계란빵", desc: "달콤하고 부드러운 크림이 담백한 계란빵과 만나 사르르 녹는 디저트입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184988/edited-photo_5_shiudy.jpg" },
      { name: "슈크림 계란빵", desc: "달콤하고 부드러운 슈크림이 계란의 고소함과 어우러지는 간식입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184989/edited-photo_3_syalvo.jpg" },
      { name: "팥 계란빵", desc: "달콤한 팥앙금과 고소한 계란이 만나 포근한 단맛을 느낄 수 있습니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781184990/edited-photo_8_h7k4xt.jpg" }
    ]
  },
  "기타": {
    id: "기타",
    label: "츄러스 & 사이드",
    title: "달콤한 간식부터 든든한 한 입까지, 사이드 메뉴",
    desc: "스페인 정통 찹쌀 츄러스와 떡볶이 삼총사, 직화불고기 핫도그까지. 매장의 시간대와 손님 취향에 맞춰 다채롭게 제안할 수 있습니다.",
    items: [
      { name: "오리지널 츄러스", desc: "쫀득한 찹쌀 식감과 바삭한 겉결을 살린, 커피와 잘 어울리는 기본 츄러스입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781185404/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90_izqnfl.jpg", badge: "대표" },
      { name: "슈가 츄러스", desc: "달콤한 슈가 코팅을 더해 한입마다 기분 좋은 바삭함을 전합니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781185405/%EC%8A%88%EA%B0%80_tzns46.jpg" },
      { name: "오레오 츄러스", desc: "달콤한 쿠키 풍미를 더해 디저트로 더욱 즐겁게 맛볼 수 있습니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781185408/%EC%98%A4%EB%A0%88%EC%98%A4_bssm74.jpg", badge: "인기" },
      { name: "녹차 츄러스", desc: "은은한 녹차 향과 담백한 단맛으로 깔끔하게 즐기기 좋은 츄러스입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781185408/%EB%85%B9%EC%B0%A8_jmac8h.jpg" },
      { name: "국물 떡볶이", desc: "달콤하면서도 매콤한 국물 한입에 자꾸 생각나는 중독적인 떡볶이입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781185350/%EA%B5%AD%EB%AC%BC1_amnxed.png", badge: "매콤달콤" },
      { name: "로제 떡볶이", desc: "고소한 크림에 달달매콤한 풍미가 더해져 부드럽게 즐길 수 있습니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781185348/%EB%A1%9C%EC%A0%9C1_lwn2j7.png", badge: "인기" },
      { name: "로제짜장 떡볶이", desc: "짜장에 로제를 더해 부드럽고 진한 맛을 즐길 수 있는 색다른 떡볶이입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781185349/%EC%A7%9C%EC%9E%A51_zktcnn.png" },
      { name: "직화불고기 핫도그", desc: "불향 가득한 직화불고기와 육즙 있는 소시지가 어우러진 든든한 메뉴입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781185539/A4_07054_2_er4md2.jpg", badge: "든든식사" }
    ]
  },
  "coffee120": {
    id: "coffee120",
    label: "120커피 & 음료",
    title: "달콤한 디저트와 완벽한 조화를 이루는 120 음료 라인업",
    desc: "엄선된 에스프레소 음료부터 신선한 과일 주스, 달콤한 쉐이크까지 120pie와 완벽히 페어링되는 다양한 음료들을 소개합니다.",
    items: [
      { name: "아메리카노", desc: "고소하고 묵직한 바디감으로 120파이와 가장 완벽하게 어울리는 대표 에스프레소 음료입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594614/%EC%95%84%EB%A9%94%EB%A6%AC%EC%B9%B4%EB%85%B8_qn2vhm.png", badge: "인기" },
      { name: "카페라떼", desc: "에스프레소의 묵직함에 부드러운 우유의 고소함을 더해 부드러운 목넘김을 선사합니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594617/%EC%B9%B4%ED%8E%98%EB%9D%BC%EB%96%BC_hxx4gl.png" },
      { name: "카푸치노", desc: "풍성하고 고운 우유 거품 and 은은한 시나몬 향이 조화롭게 어우러진 클래식 커피입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594625/%EC%B9%B4%ED%91%B8%EC%B9%98%EB%85%B82_lzqz34.png" },
      { name: "바닐라라떼", desc: "천연 바닐라 빈의 달콤하고 향긋한 풍미가 라떼의 고소함과 달콤하게 조화됩니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594630/%EB%B0%94%EB%8B%90%EB%9D%BC%EB%9D%BC%EB%96%BC_egaeff.png", badge: "추천" },
      { name: "카라멜마끼아또", desc: "부드러운 우유와 깊은 에스프레소 위에 달콤한 카라멜 소스를 더한 달콤한 음료입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594637/%EC%B9%B4%EB%9D%BC%EB%A9%9C%EB%A7%88%EB%81%BC%EC%95%84%EB%98%902_lelmg4.png" },
      { name: "카페모카", desc: "진한 에스프레소와 달콤한 초콜릿, 부드러운 우유가 만나 쌉싸름하면서도 달콤합니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594639/%EC%B9%B4%ED%8E%98%EB%AA%A8%EC%B9%B42_vpcsd0.png" },
      { name: "연유카페라떼", desc: "달콤한 연유와 고소한 우유, 에스프레소가 조화를 이루는 부드러운 단맛의 라떼입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594648/%EC%97%B0%EC%9C%A0%EC%B9%B4%ED%8E%98%EB%9D%BC%EB%96%BC2_qsvl7v.png" },
      { name: "콜드브루", desc: "오랜 시간 차가운 물로 우려내어 깔끔하고 부드러운 바디감이 돋보이는 커피입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594651/%EC%BD%9C%EB%93%9C%EB%B8%8C%EB%A3%A8_mshias.png", badge: "깔끔한맛" },
      { name: "콜드브루라떼", desc: "콜드브루 특유의 깔끔하고 깊은 풍미에 부드러운 우유를 더해 더욱 담백합니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594654/%EC%BD%9C%EB%93%9C%EB%B8%8C%EB%A3%A8%EB%9D%BC%EB%96%BC2_fgyrox.png" },
      { name: "연유 콜드브루", desc: "깔끔하고 향긋한 콜드브루에 달콤한 연유가 스며들어 고급스러운 달콤함을 전합니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594659/%EC%97%B0%EC%9C%A0_%EC%BD%9C%EB%93%9C%EB%B8%8C%EB%A3%A82_vozqcs.png" },
      { name: "흑당라떼", desc: "대만 오리지널 흑당의 깊고 진한 달콤함과 부드러운 우유가 어우러진 논커피 라떼입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594662/%ED%9D%91%EB%8B%B9%EB%9D%BC%EB%96%BC_zg0rsf.png" },
      { name: "곡물라떼", desc: "다양한 곡물의 고소함과 든든함이 어우러져 한 끼 식사 대용으로도 훌륭한 라떼입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594667/%EA%B3%A1%EB%AC%BC%EB%9D%BC%EB%96%BC2_xmudz1.png", badge: "든든" },
      { name: "고구마라떼", desc: "달콤하고 부드러운 고구마의 풍미와 고소한 우유가 따뜻하게 어우러지는 라떼입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594670/%EA%B3%A0%EA%B5%AC%EB%A7%88%EB%9D%BC%EB%96%BC2_ya5oyd.png" },
      { name: "딸기라떼", desc: "상큼하고 달콤한 진짜 딸기 과육이 듬뿍 들어가 우유와 상쾌하게 섞이는 인기 음료입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594673/%EB%94%B8%EA%B8%B0%EB%9D%BC%EB%96%BC_mefpyg.png", badge: "인기" },
      { name: "토피넛라떼", desc: "고소한 견과류와 달콤한 버터스카치 풍미가 풍부하게 어우러진 시그니처 논커피 라떼입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594679/%ED%86%A0%ED%94%BC%EB%84%9B%EB%9D%BC%EB%96%BC2_fxx4la.png" },
      { name: "녹차라떼", desc: "쌉싸름한 제주 녹차의 풍미와 부드러운 우유가 만나 차분하고 깊은 맛을 냅니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594683/%EB%85%B9%EC%B0%A8%EB%9D%BC%EB%96%BC_c9q9wu.png" },
      { name: "달고나라떼", desc: "바삭하고 달콤한 수제 달고나가 우유 위에 올라가 녹아내리며 재미와 맛을 더합니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594687/%EB%8B%AC%EA%B3%A0%EB%82%98%EB%9D%BC%EB%96%BC2_rh97dz.png" },
      { name: "피스타치오라떼", desc: "피스타치오 고유의 고소한 풍미와 매력적인 그린 컬러가 돋보이는 부드러운 라떼입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594692/%ED%94%BC%EC%8A%A4%ED%83%80%EC%B9%98%EC%98%A4%EB%9D%BC%EB%96%BC2_qhmttf.png" },
      { name: "미숫가루", desc: "전통 방식 그대로 고소하고 걸쭉하게 타내어 남녀노소 추억을 부르는 건강 음료입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594697/%EB%AF%B8%EC%88%AB%EA%B0%80%EB%A3%A82_h8gehs.png" },
      { name: "초당옥수수라떼", desc: "달콤하고 고소한 초당옥수수의 매력을 부드러운 크림과 함께 즐길 수 있는 이색 라떼입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594702/%EC%B4%88%EB%8B%B9%EC%98%A5%EC%88%98%EC%88%98%EB%9D%BC%EB%96%BC2_etf8dq.png", badge: "신메뉴" },
      { name: "딸기 요거트스무디", desc: "새콤달콤한 요거트 베이스에 상큼한 딸기 과육이 블렌딩된 상쾌한 스무디입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594708/%EB%94%B8%EA%B8%B0_%EC%9A%94%EA%B1%B0%ED%8A%B8%EC%8A%A4%EB%AC%B4%EB%94%942_nbnyqp.png" },
      { name: "망고 요거트스무디", desc: "부드럽고 진한 요거트에 달콤하고 향긋한 망고가 가득 녹아든 트로피컬 스무디입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594714/%EB%A7%9D%EA%B3%A0_%EC%9A%94%EA%B1%B0%ED%8A%B8%EC%8A%A4%EB%AC%B4%EB%94%942_cwywih.png", badge: "추천" },
      { name: "딸기망고블루베리 스무디", desc: "세 가지 베리와 과일이 만나 상큼함과 달콤함이 폭발하는 상큼 비타민 스무디입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594718/%EB%94%B8%EA%B8%B0%EB%A7%9D%EA%B3%A0%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC_%EC%8A%A4%EB%AC%B4%EB%94%94_af48jr.png" },
      { name: "딸기바나나 스무디", desc: "딸기의 상큼함과 바나나의 든든하고 부드러운 단맛이 최상의 조화를 이루는 스무디입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594721/%EB%94%B8%EA%B8%B0%EB%B0%94%EB%82%98%EB%82%98_%EC%8A%A4%EB%AC%B4%EB%94%94_k98pno.png" },
      { name: "수박 스무디", desc: "여름철 갈증을 한 번에 날려줄 달콤하고 시원한 진짜 수박의 맛을 담은 블렌디드입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594724/%EC%88%98%EB%B0%95_%EC%8A%A4%EB%AC%B4%EB%94%94_xizimi.png", badge: "여름시즌" },
      { name: "복숭아 아이스티", desc: "향긋한 홍차 베이스에 달콤하고 상큼한 복숭아 향이 입안 가득 시원하게 퍼지는 음료입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594750/%EB%B3%B5%EC%88%AD%EC%95%84_%EC%95%84%EC%9D%B4%EC%8A%A4%ED%8B%B02_zy1xrm.png" },
      { name: "자몽 에이드", desc: "쌉싸름하면서도 달콤한 자몽 과육과 시원한 탄산수가 만나 활력을 더하는 에이드입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594779/%EC%9E%90%EB%AA%BD_%EC%97%90%EC%9D%B4%EB%93%9C2_dmdi0k.png" },
      { name: "레몬 에이드", desc: "갓 짠 듯한 상큼하고 상쾌한 레몬즙에 톡 쏘는 스파클링이 가득한 비타민 에이드입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594783/%EB%A0%88%EB%AA%AC_%EC%97%90%EC%9D%B4%EB%93%9C2_z4g3g3.png" },
      { name: "청포도 에이드", desc: "싱그럽고 청량한 청포도의 달콤함에 톡톡 터지는 식감을 더한 에이드입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594786/%EC%B2%AD%ED%8F%AC%EB%8F%84_%EC%97%90%EC%9D%B4%EB%93%9C2_rbww0m.png" },
      { name: "제주한라봉", desc: "제주 한라봉 고유의 진하고 달콤한 향과 과육이 가득 퍼지는 프리미엄 에이드입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594790/%EC%A0%9C%EC%A3%BC%ED%95%9C%EB%9D%BC%EB%B4%89_%EC%97%90%EC%9D%B4%EB%93%9C2_hwrd2x.png", badge: "시그니처" },
      { name: "밀크 쉐이크", desc: "부드러운 바닐라 아이스크림 베이스로 진하고 고소한 풍미가 가득한 클래식 쉐이크입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594794/%EB%B0%80%ED%81%AC%EC%89%90%EC%9D%B4%ED%81%AC_olhchd.png" },
      { name: "딸기 쉐이크", desc: "상큼한 딸기의 단맛이 밀크 쉐이크 특유의 녹아내리는 부드러움과 환상적으로 조화를 이룹니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594797/%EB%94%B8%EA%B8%B0%EC%89%90%EC%9D%B4%ED%81%AC_luxgk0.png" },
      { name: "쿠앤크 쉐이크", desc: "달콤하고 바삭한 초코 쿠키가 듬뿍 들어가 씹는 맛과 풍부한 단맛을 자랑하는 쉐이크입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594800/%EC%BF%A0%EC%95%A4%ED%81%AC%EC%89%90%EC%9D%B4%ED%81%AC_mddmzw.png", badge: "인기" },
      { name: "초코 쉐이크", desc: "진하고 풍부한 초콜릿 풍미를 부드럽게 갈아내어 깊은 달콤함을 선사하는 쉐이크입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594803/%EC%B4%88%EC%BD%94%EC%89%90%EC%9D%B4%ED%81%AC_k13wi2.png" },
      { name: "커피 쉐이크", desc: "깊고 그윽한 에스프레소 샷이 밀크 쉐이크와 만나 고급스럽고 시원한 맛을 냅니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594807/%EC%BB%A4%ED%94%BC_%EC%89%90%EC%9D%B4%ED%81%AC2_ypr12t.png" },
      { name: "딸기 주스", desc: "상큼한 딸기 과육을 듬뿍 갈아 넣어 딸기 본연의 생생하고 신선한 맛을 느낄 수 있습니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594811/%EB%94%B8%EA%B8%B0%EC%A3%BC%EC%8A%A4_uo7vkh.png" },
      { name: "망고 주스", desc: "달콤하고 잘 익은 프리미엄 망고를 시원하게 즐길 수 있는 진한 과일 주스입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594814/%EB%A7%9D%EA%B3%A0%EC%A3%BC%EC%8A%A4_stoklt.png" },
      { name: "블루베리 주스", desc: "안토시아닌이 풍부한 상큼한 블루베리를 진하고 달콤하게 블렌딩한 건강 주스입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594817/%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC%EC%A3%BC%EC%8A%A4_drjxl0.png" },
      { name: "애플망고 주스", desc: "고급스러운 단맛의 애플망고를 듬뿍 넣어 한 모금마다 향긋함을 가득 채우는 주스입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594821/%EC%95%A0%ED%94%8C%EB%A7%9D%EA%B3%A0_%EC%A3%BC%EC%8A%A42_acsy4h.png", badge: "인기" },
      { name: "오렌지 주스", desc: "상큼하고 싱그러운 오렌지 본연의 비타민을 가득 담아 가볍고 청량한 과일 주스입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1781594824/%EC%98%A4%EB%A0%8C%EC%A7%80_%EC%A3%BC%EC%8A%A42_uhicvy.png" }
    ]
  },
  "스콘/머핀/쿠키": {
    id: "스콘/머핀/쿠키",
    label: "스콘/머핀/쿠키",
    title: "바삭하고 포근한 베이커리 디저트, 스콘 & 머핀 & 쿠키",
    desc: "매일 아침 구워낸 듯 향긋한 버터 풍미를 선사합니다. 부드러운 스콘과 촉촉한 머핀, 바삭한 수제 쿠키로 가벼운 디저트 타임을 완성해보세요.",
    items: [
      { name: "초코칩 스콘", desc: "달콤한 초코칩이 아낌없이 박혀 씹을수록 깊은 단맛과 풍미를 전하는 스콘입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782365351/%EC%B4%88%EC%BD%94%EC%B9%A9_%EC%8A%A4%EC%BD%98_vaw70u.png", badge: "인기" },
      { name: "플레인 스콘", desc: "고소한 버터 본연의 풍미를 가득 담아 딸기잼이나 커피와 가장 잘 어울리는 클래식 스콘입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782365356/%ED%94%8C%EB%A0%88%EC%9D%B8_%EC%8A%A4%EC%BD%98_zf7yz8.png", badge: "대표" },
      { name: "블루베리 머핀", desc: "톡톡 터지는 새콤달콤한 블루베리 과육이 촉촉한 머핀 시트와 조화를 이루는 디저트입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782365357/%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC_%EB%A8%B8%ED%95%80_jrqlkm.png" },
      { name: "초코 머핀", desc: "진하고 꾸덕한 초콜릿의 달콤함과 부드러운 머핀의 식감을 동시에 즐길 수 있습니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782365362/%EC%B4%88%EC%BD%94_%EB%A8%B8%ED%95%80_jvi1d3.png", badge: "인기" },
      { name: "치즈 머핀", desc: "고소하고 짭조름한 황치즈 풍미가 가득 담겨 촉촉하고 담백한 머핀입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782365359/%EC%B9%98%EC%A6%88_%EB%A8%B8%ED%95%80_wncm5n.png" },
      { name: "다크초코쿠키", desc: "진한 다크 초콜릿의 깊은 카카오 풍미와 바삭한 쿠키의 조화가 돋보입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782365364/%EB%8B%A4%ED%81%AC%EC%B4%88%EC%BD%94%EC%BF%A0%ED%82%A4_zshapc.png" },
      { name: "마카다미아 초코쿠키", desc: "오독오독 씹히는 고소한 마카다미아 넛츠와 부드러운 초코칩이 조화를 이룹니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782365363/%EB%A7%88%EC%B9%B4%EB%8B%A4%EB%AF%B8%EC%95%84_%EC%B4%88%EC%BD%94%EC%BF%A0%ED%82%A4_evtonk.png", badge: "추천" },
      { name: "캐슈넛쿠키", desc: "고소하고 담백한 캐슈넛을 듬뿍 토핑하여 구워낸 건강하고 달콤한 쿠키입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782365363/%EC%BA%90%EC%8A%88%EB%84%9B%EC%BF%A0%ED%82%A4_pt97ab.png" }
    ]
  },
  "크로플/마카롱": {
    id: "크로플/마카롱",
    label: "크로플/마카롱",
    title: "트렌디한 단짠의 정석, 크로플 & 마카롱",
    desc: "버터향 가득한 크루아상 생지를 바삭하게 구워낸 크로플과 입안 가득 쫀득하고 달콤한 뚱카롱입니다.",
    items: [
      { name: "딸기&크림 크로플", desc: "갓 구운 크로플 위에 부드러운 휩크림과 상큼한 딸기 잼, 토핑이 어우러진 비주얼 디저트입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782365366/%EB%94%B8%EA%B8%B0_%ED%81%AC%EB%A6%BC_%ED%81%AC%EB%A1%9C%ED%94%8C_jjoz6d.png", badge: "인기" },
      { name: "블루베리&크림 크로플", desc: "바삭한 크로플 위에 달콤 고소한 크림과 톡톡 씹히는 블루베리를 얹어 상큼함을 배가시켰습니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782365365/%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC_%ED%81%AC%EB%A6%BC_%ED%81%AC%EB%A1%9C%ED%94%8C_mjc7pi.png" },
      { name: "솔티드카라멜 크로플", desc: "단짠단짠의 정석! 짭짤한 솔트와 달콤하고 풍부한 카라멜 소스를 뿌린 크로플입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782365368/%EC%86%94%ED%8B%B0%EB%93%9C%EC%B9%B4%EB%9D%BC%EB%A9%9C_%ED%81%AC%EB%A1%9C%ED%94%8C_pfoegr.png", badge: "대표" },
      { name: "초코렛폭탄 크로플", desc: "초코 소스와 초콜릿 토핑을 폭탄처럼 얹어 초콜릿의 극대화된 단맛을 전하는 크로플입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782365367/%EC%B4%88%EC%BD%94%EB%A0%9B%ED%8F%AD%ED%83%84_%ED%81%AC%EB%A1%9C%ED%94%8C_maupyq.png", badge: "초코덕후" },
      { name: "흑당 크로플", desc: "대만 오리지널 흑당의 진한 풍미가 갓 구운 크로플 깊숙이 스며들어 달콤하고 향긋합니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782365366/%ED%9D%91%EB%8B%B9_%ED%81%AC%EB%A1%9C%ED%94%8C_tul0cj.png" },
      { name: "산딸기 마카롱", desc: "쫀득한 꼬끄 속에 상큼한 산딸기 필링이 듬뿍 들어가 상쾌한 단맛을 전합니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782365369/edited-photo_79_x1ikz0.png", badge: "상큼단맛" },
      { name: "블루베리 마카롱", desc: "진하고 부드러운 크림과 상큼한 블루베리 풍미가 쫀득한 꼬끄 사이에 가득한 마카롱입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782365369/edited-photo_80_gbtyyq.png" },
      { name: "초코 마카롱", desc: "쌉싸름하고 깊은 초콜릿 가나슈 필링이 쫀득하게 채워진 깊은 풍미의 마카롱입니다.", img: "https://res.cloudinary.com/dfarfqx7e/image/upload/v1782365370/edited-photo_81_ydg87f.png", badge: "인기" }
    ]
  }
};
