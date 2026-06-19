"use client";

export interface RecipeStep {
  name: string;
  capacity: string;
  etcName?: string;
  etcCapacity?: string;
}

export interface RecipeItem {
  no: string | number;
  name: string;
  steps: RecipeStep[];
  note?: string;
}

export interface RecipeSubCategory {
  name: string;
  recipes: RecipeItem[];
}

export interface RecipeCategory {
  name: string;
  subCategories: RecipeSubCategory[];
}

export const RECIPE_DATA: RecipeCategory[] = [
  {
    "name": "120겹파이 음료 기본 용량 (HOT)",
    "subCategories": [
      {
        "name": "COFFEE 카테고리 (종이컵 16oz) * 사이즈 확인",
        "recipes": [
          {
            "no": 1,
            "name": "아메리카노",
            "steps": [
              {
                "name": "뜨거운물",
                "capacity": "350g",
                "etcName": "에스크레소 2샷",
                "etcCapacity": "2샷"
              }
            ],
            "note": ""
          },
          {
            "no": 2,
            "name": "카페라떼",
            "steps": [
              {
                "name": "스팀우유",
                "capacity": "시팀전 300g 스팀후 330g",
                "etcName": "에스크레소 2샷",
                "etcCapacity": "2샷"
              }
            ],
            "note": ""
          },
          {
            "no": 3,
            "name": "바닐라빈라떼",
            "steps": [
              {
                "name": "바닐라 파우더 2S(30g) / 에스프레소 1샷 MIX 후",
                "capacity": "",
                "etcName": "",
                "etcCapacity": "1샷"
              }
            ],
            "note": "스팀우유 300g"
          },
          {
            "no": 4,
            "name": "카페모카",
            "steps": [
              {
                "name": "초코소스",
                "capacity": "1P(30ml)",
                "etcName": "에스크레소 1샷",
                "etcCapacity": "1샷"
              },
              {
                "name": "스팀우유 300g",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "휘핑크림                  (초코소스 Z드리즐)"
          },
          {
            "no": 5,
            "name": "카라멜라떼",
            "steps": [
              {
                "name": "카라멜소스 30g  / 에스프레소 1샷 MIX 후",
                "capacity": "",
                "etcName": "",
                "etcCapacity": "1샷"
              }
            ],
            "note": "위핑크림                  (카라멜소스 Z드리즐)\n스팀우유 300g"
          },
          {
            "no": 6,
            "name": "돌체라떼",
            "steps": [
              {
                "name": "연유 40ml / 에스프레스 1샷 MIX 후",
                "capacity": "",
                "etcName": "",
                "etcCapacity": "1샷"
              }
            ],
            "note": "스팀우유 300g"
          }
        ]
      },
      {
        "name": "NON . COFFEE LATTE 카테고리 (종이컵 16oz / 스팀우유(스팀피쳐 사용)",
        "recipes": [
          {
            "no": 1,
            "name": "초당옥수수라떼",
            "steps": [
              {
                "name": "초당옥수수 퓨레 70ml",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              },
              {
                "name": "스팀우유 300g MIX",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 2,
            "name": "말차라떼",
            "steps": [
              {
                "name": "말차 액상 시럽 70ml",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              },
              {
                "name": "스팀우유 300g MIX",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              },
              {
                "name": "* 초코소스 추가 + 30g (15g 액상과 MIX / 15g 우유거품 위 드리즐)                                                   * 샷추가 + 에스프레소 1샷 액상과 MIX",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 3,
            "name": "리얼 고구마라떼",
            "steps": [
              {
                "name": "고구마 페이스트 70ml",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              },
              {
                "name": "스팀우유 300g MIX",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 4,
            "name": "초코라떼",
            "steps": [
              {
                "name": "초코소스 2P (60ml)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              },
              {
                "name": "스팀우유 300g MIX",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "휘핑크림                  (초코소스 Z드리즐)"
          },
          {
            "no": 5,
            "name": "피스타치오라떼",
            "steps": [
              {
                "name": "피스타치오 파우더 3S (45g)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              },
              {
                "name": "스팀우유 300g MIX",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": ""
          }
        ]
      },
      {
        "name": "MILK TEA 카테고리 (종이컵 16oz / 스팀우유) (스팀피쳐 사용)",
        "recipes": [
          {
            "no": 1,
            "name": "얼그레이홍차밀크티",
            "steps": [
              {
                "name": "밀크티 파우더 3S (45g)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              },
              {
                "name": "스팀우유 300g MIX",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "펄 제공x"
          },
          {
            "no": 2,
            "name": "타로밀크티",
            "steps": [
              {
                "name": "타로 파우더 3S (45g)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              },
              {
                "name": "스팀우유 300g MIX",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "펄 제공x"
          }
        ]
      },
      {
        "name": "TEA 카테고리 (종이컵 16oz)",
        "recipes": [
          {
            "no": 1,
            "name": "달콤티(유자/자몽)",
            "steps": [
              {
                "name": "유자청/자몽청",
                "capacity": "70g",
                "etcName": "유자/자몽청70g . 뜨거운 물 350g",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "우려낸 후",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 2,
            "name": "달콤티(레몬)",
            "steps": [
              {
                "name": "레몬청",
                "capacity": "80g",
                "etcName": "레몬청 80g . 뜨거운 물 350g",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "우려낸 후",
                "etcCapacity": ""
              }
            ],
            "note": "레몬슬라이스 3개 포함"
          },
          {
            "no": 3,
            "name": "허브티",
            "steps": [
              {
                "name": "티백",
                "capacity": "1",
                "etcName": "허브차티백 1개(뜨거운 물 360g)",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "(얼그레이 / 캐모마일 / 페퍼민트 / 하비스커스)",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 4,
            "name": "오렌지자몽블랙티",
            "steps": [
              {
                "name": "티백 . 말린과일",
                "capacity": "1",
                "etcName": "오렌지자몽블랙티 티백 1개                        (뜨거운 물 360g)",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "우려낸 후",
                "etcCapacity": ""
              }
            ],
            "note": "말린과일 1개"
          },
          {
            "no": 5,
            "name": "레몬얼그레이티",
            "steps": [
              {
                "name": "티백 . 말린과일",
                "capacity": "1",
                "etcName": "레몬얼그레이티 티 티백 1개                       (뜨거운 물 360g)",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "우려낸 후",
                "etcCapacity": ""
              }
            ],
            "note": "말린과일 1개"
          }
        ]
      }
    ]
  },
  {
    "name": "120겹파이 음료 기본 용량 (ICE)",
    "subCategories": [
      {
        "name": "COFFEE 카테고리 (종이컵 22oz) * 사이즈 확인",
        "recipes": [
          {
            "no": 1,
            "name": "아메리카노",
            "steps": [
              {
                "name": "물",
                "capacity": "200g",
                "etcName": "얼음가득(300g) . 에스프레소 2샷",
                "etcCapacity": "2샷"
              }
            ],
            "note": ""
          },
          {
            "no": 2,
            "name": "카페라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "200g",
                "etcName": "얼음가득(300g) . 에스프레소 2샷",
                "etcCapacity": "2샷"
              }
            ],
            "note": ""
          },
          {
            "no": 3,
            "name": "원라떼(10oz/296ml)",
            "steps": [
              {
                "name": "얼음가득(100g) . 우유80g . 에스프레소 1샷",
                "capacity": "",
                "etcName": "",
                "etcCapacity": "1샷"
              },
              {
                "name": "생크림360g, 연유72g, 버터스카치 시럽18g                                                        (약 12회 분량) 핸드믹서로 MIX(요거트 농도 2~5분 내 종료)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "원라떼크림 30g"
          },
          {
            "no": 4,
            "name": "바닐라라떼",
            "steps": [
              {
                "name": "[바닐라 파우더 2S(30g) . 에스크레소 1샷 MIX] . 얼음가득(300g)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": "1샷"
              },
              {
                "name": "우유200g",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 5,
            "name": "카페모카",
            "steps": [
              {
                "name": "[초코소스 1P(30ml) . 에스프레소 1샷 MIX] . 얼음가득(300g)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": "1샷"
              },
              {
                "name": "우유200g",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "휘핑크림                  (초코소스Z 드리즐)"
          },
          {
            "no": 6,
            "name": "카라멜라떼",
            "steps": [
              {
                "name": "[카라멜소스 30g . 에스프레소 1샷 MIX] . 얼음가득(300g)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": "1샷"
              },
              {
                "name": "우유200g",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "휘핑크림                  (카라멜소스Z 드리즐)"
          },
          {
            "no": 7,
            "name": "돌체라떼",
            "steps": [
              {
                "name": "[연유 40ml . 에스프레소 1샷 MIX] . 얼음가득(300g)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": "1샛"
              },
              {
                "name": "우유200g",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 8,
            "name": "아샷추",
            "steps": [
              {
                "name": "[아이스티 파우더 3S(45g) . 뜨거운물 50g MIX] . 얼음가득(300g)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": "1샷"
              },
              {
                "name": "물200g",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "에스크레소 1샷\n(이이스티+샷추가)"
          }
        ]
      }
    ]
  },
  {
    "name": "COLD BREW 카테고리 (22oz) * 사이즈 확인",
    "subCategories": [
      {
        "name": "기본 레시피",
        "recipes": [
          {
            "no": 1,
            "name": "콜드브루",
            "steps": [
              {
                "name": "물",
                "capacity": "120g",
                "etcName": "콜드부르 원액",
                "etcCapacity": "150g"
              }
            ],
            "note": "얼음가득(300g)"
          },
          {
            "no": 2,
            "name": "콜드브루라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "120g",
                "etcName": "콜드부르 원액",
                "etcCapacity": "150g"
              }
            ],
            "note": "얼음가득(300g)"
          },
          {
            "no": 3,
            "name": "디카페인 콜드브루",
            "steps": [
              {
                "name": "물",
                "capacity": "120g",
                "etcName": "디카페인 콜드브루 원액",
                "etcCapacity": "150g"
              }
            ],
            "note": "얼음가득(300g)"
          },
          {
            "no": 4,
            "name": "디카페인               콜드브루 라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "120g",
                "etcName": "디카페인 콜드브루 원액",
                "etcCapacity": "150g"
              }
            ],
            "note": "얼음가득(300g)"
          }
        ]
      }
    ]
  },
  {
    "name": "NON . COFFEE LATTE 카테고리 (22oz) * 사이즈 확인",
    "subCategories": [
      {
        "name": "기본 레시피",
        "recipes": [
          {
            "no": 1,
            "name": "리얼 딸기라떼(ICE)",
            "steps": [
              {
                "name": "우유",
                "capacity": "200g",
                "etcName": "딸기청 100g . 카페시럽 2P (20ml)",
                "etcCapacity": ""
              }
            ],
            "note": "얼음가득(300g)\n딸기청 제조 : 냉동딸기 1kg (완전히 해동) . 백설탕 300g 블렌더 MIX (알갱이가 보이도록)"
          },
          {
            "no": 2,
            "name": "초당옥수수라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "200g",
                "etcName": "초당옥수수 퓨레",
                "etcCapacity": "70g"
              }
            ],
            "note": "얼음가득(300g)"
          },
          {
            "no": 3,
            "name": "말차라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "200g",
                "etcName": "말차 액상 시럽",
                "etcCapacity": "70g"
              },
              {
                "name": "* 초코소스 추가 + 30g (말차라떼 제조 후, 초코소스 드리즐)                                                        * 샷 추가 + 에스프레소 1샷 (말차라떼 제조 후, 위에 부어주기)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "얼음가득(300g)"
          },
          {
            "no": 4,
            "name": "리얼 고구마라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "200g",
                "etcName": "고구마 페이스트",
                "etcCapacity": "70g"
              }
            ],
            "note": "얼음가득(300g)"
          },
          {
            "no": 5,
            "name": "미숫가루(ICE)",
            "steps": [
              {
                "name": "미숫가루 3S (45g) . 카세시럽 2P (20ml) . 우유 300ml 블렌더 MIX",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              },
              {
                "name": "핸드믹서로 간편 사용 가능!",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "얼음가득(300g)"
          },
          {
            "no": 6,
            "name": "초코라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "200g",
                "etcName": "초코소스",
                "etcCapacity": "2P (60ml)"
              }
            ],
            "note": "휘칭크림                   (초코소스 Z드리즐)"
          },
          {
            "no": 7,
            "name": "바닐라라떼(ICE)",
            "steps": [
              {
                "name": "우유",
                "capacity": "200g",
                "etcName": "바나나 파우더",
                "etcCapacity": "3S (45g)"
              }
            ],
            "note": "얼음가득(300g)"
          },
          {
            "no": 8,
            "name": "메로나라떼(ICE)",
            "steps": [
              {
                "name": "우유",
                "capacity": "200g",
                "etcName": "멜론 파우더",
                "etcCapacity": "3S (45g)"
              }
            ],
            "note": "얼음가득(300g)"
          },
          {
            "no": 9,
            "name": "피스타치오라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "200g",
                "etcName": "피스타치오 파우더",
                "etcCapacity": "3S (45g)"
              }
            ],
            "note": "얼음가득(300g)"
          }
        ]
      }
    ]
  },
  {
    "name": "MILK TEA 카테고리 (22oz) * 사이즈 확인",
    "subCategories": [
      {
        "name": "기본 레시피",
        "recipes": [
          {
            "no": 1,
            "name": "얼그레이홍차밀크티",
            "steps": [
              {
                "name": "우유",
                "capacity": "200g",
                "etcName": "밀크티 파우더",
                "etcCapacity": "3S (45g)"
              },
              {
                "name": "타피오카펄 1팩 전자레인지 1분 30초 / 타피오카펄 2팩 전자레인지 3분 30초",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "펄 제공(1팩)"
          },
          {
            "no": 2,
            "name": "타로밀크티",
            "steps": [
              {
                "name": "우유",
                "capacity": "200g",
                "etcName": "타로 파우더",
                "etcCapacity": "3S (45g)"
              },
              {
                "name": "타피오카펄 1팩 전자레인지 1분 30초 / 타피오카펄 2팩 전자레인지 3분 30초",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "펄 제공(1팩)"
          }
        ]
      }
    ]
  },
  {
    "name": "TEA 카테고리 (22oz) * 사이즈 확인",
    "subCategories": [
      {
        "name": "기본 레시피",
        "recipes": [
          {
            "no": 1,
            "name": "복숭아아이스티",
            "steps": [
              {
                "name": "얼음가득 (300g) . [복숭아 아이스티 파우더 3S (45g) . 뜨거운물 150g MIX] -> 추가얼음",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "뜨거운물 150g"
          },
          {
            "no": 2,
            "name": "레몬아이스티",
            "steps": [
              {
                "name": "물",
                "capacity": "200g",
                "etcName": "레몬아이스티 시럽",
                "etcCapacity": "2P (60ml)"
              }
            ],
            "note": ""
          },
          {
            "no": 3,
            "name": "석류아이스티",
            "steps": [
              {
                "name": "얼음가득 (300g) . [석류 아이스티 파우더 3S (45g) . 뜨거운물 150g MIX] -> 추가얼음",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "뜨거운물 150g"
          },
          {
            "no": 4,
            "name": "제로아이스티",
            "steps": [
              {
                "name": "물",
                "capacity": "200g",
                "etcName": "제로아이스티 시럽",
                "etcCapacity": "70ml"
              }
            ],
            "note": ""
          },
          {
            "no": 5,
            "name": "달콤티(유자/자몽)",
            "steps": [
              {
                "name": "얼음가득 (300g) . [유자/자몽청 70g . 뜨거운물 150g MIX] -> 추가얼음",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "뜨거운물 150g"
          },
          {
            "no": 6,
            "name": "달콤티(레몬)",
            "steps": [
              {
                "name": "얼음가득 (300g) . [레몬청 80g . 뜨거운물 150g MIX] -> 추가얼음",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "레몬슬라이스 3개 포함"
          },
          {
            "no": 7,
            "name": "허브티",
            "steps": [
              {
                "name": "티백",
                "capacity": "1",
                "etcName": "얼음가득 (300g) . [허브차티백1개 . 뜨거운물 150g MIX] -> 추가얼음",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "(얼그레이/캐모마일/페퍼민트/히비스커스)",
                "etcCapacity": ""
              }
            ],
            "note": "(계량컵)"
          },
          {
            "no": 8,
            "name": "오렌지자몽블랙티",
            "steps": [
              {
                "name": "티백 . 말린과일",
                "capacity": "1",
                "etcName": "얼음가득 (300g) . [오렌지자몽블랙티 티백1개 . 뜨거운물 150g MIX] -> 추가얼음",
                "etcCapacity": ""
              }
            ],
            "note": "말린과일 1개\n(계량컵)"
          },
          {
            "no": 9,
            "name": "레몬얼그레이티",
            "steps": [
              {
                "name": "티백 . 말린과일",
                "capacity": "1",
                "etcName": "얼음가득 (300g) . [레몬얼그레이티 티백1개 . 뜨거운물 150g MIX] -> 추가얼음",
                "etcCapacity": ""
              }
            ],
            "note": "말린과일 1개\n(계량컵)"
          }
        ]
      }
    ]
  },
  {
    "name": "ADE 카테고리 (22oz) * 사이즈 확인",
    "subCategories": [
      {
        "name": "기본 레시피",
        "recipes": [
          {
            "no": 1,
            "name": "체리콕",
            "steps": [
              {
                "name": "콜라",
                "capacity": "200ml",
                "etcName": "체리농축액 70ml . 카페시럽 1P (10ml)",
                "etcCapacity": ""
              }
            ],
            "note": "얼음가득(300g)"
          },
          {
            "no": 2,
            "name": "자두복숭아에이드",
            "steps": [
              {
                "name": "",
                "capacity": "200ml",
                "etcName": "자두복숭아 퓨레",
                "etcCapacity": "70ml"
              }
            ],
            "note": "얼음가득(300g)"
          },
          {
            "no": 3,
            "name": "제주한라봉에이드",
            "steps": [
              {
                "name": "탄산수",
                "capacity": "200ml",
                "etcName": "한라봉 퓨레 70ml . 카페시럽 1P (10ml)",
                "etcCapacity": ""
              }
            ],
            "note": "얼음가득(300g)"
          },
          {
            "no": 4,
            "name": "샤인머스켓에이드",
            "steps": [
              {
                "name": "탄산수",
                "capacity": "200ml",
                "etcName": "샤인머스켓 퓨레",
                "etcCapacity": "70ml"
              }
            ],
            "note": "얼음가득(300g)"
          },
          {
            "no": 5,
            "name": "자몽에이드",
            "steps": [
              {
                "name": "탄산수",
                "capacity": "200ml",
                "etcName": "자몽 농축액 70ml . 카페시럽 1P (10ml)",
                "etcCapacity": ""
              }
            ],
            "note": "얼음가득(300g)"
          },
          {
            "no": 6,
            "name": "레몬에이드",
            "steps": [
              {
                "name": "탄산수",
                "capacity": "200ml",
                "etcName": "레몬청 (슬라이스 3개 포함)",
                "etcCapacity": "80g"
              }
            ],
            "note": "얼음가득(300g)"
          }
        ]
      }
    ]
  },
  {
    "name": "SMOOTHIE 카테고리 (22oz) * 사이즈 확인",
    "subCategories": [
      {
        "name": "기본 레시피",
        "recipes": [
          {
            "no": 1,
            "name": "캔디바소다스무디",
            "steps": [
              {
                "name": "물, 우유",
                "capacity": "75g / 75g",
                "etcName": "소다 파우더 3S (45g) . 얼음 400g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 2,
            "name": "자두복숭아스무디",
            "steps": [
              {
                "name": "물",
                "capacity": "150g",
                "etcName": "자두복숭아퓨레 70ml . 얼음 400g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 3,
            "name": "탱크보이스무디",
            "steps": [
              {
                "name": "물",
                "capacity": "150g",
                "etcName": "배 퓨레 4P(120ml) . 얼음 400g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 4,
            "name": "딸기스무디",
            "steps": [
              {
                "name": "물",
                "capacity": "150g",
                "etcName": "딸기퓨레 4P(120ml) . 냉동딸기 3알 .  얼음 400g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 5,
            "name": "한라봉스무디",
            "steps": [
              {
                "name": "물",
                "capacity": "150g",
                "etcName": "한라봉퓨레 70ml . 카페시럽 2P(20ml) .  얼음 400g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 6,
            "name": "콩커피코코넛스무디",
            "steps": [
              {
                "name": "우유",
                "capacity": "100g",
                "etcName": "코코넛 퓨레 70ml . 연유 30ml . 얼음 350g . MIX",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "에스프레소 1샷",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 1,
            "name": "플레인 요거트스무디",
            "steps": [
              {
                "name": "우유",
                "capacity": "150g",
                "etcName": "요거트 파우더 3S (45g) . 카페시럽 2P(20ml) .  얼음 350g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 2,
            "name": "딸기 요거트스무디",
            "steps": [
              {
                "name": "우유",
                "capacity": "150g",
                "etcName": "요거트 파우더 3S (45g) . 딸기퓨레 2P(60ml) . 냉동딸기3알 .                얼음 350g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 3,
            "name": "블루베리 요거트스무디",
            "steps": [
              {
                "name": "우유",
                "capacity": "150g",
                "etcName": "요거트 파우더 3S (45g) . 딸기퓨레 2P(20ml) . 냉동블루베리15알 .         얼음 350g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          }
        ]
      }
    ]
  },
  {
    "name": "FRAFFE 카테고리 (22oz) * 사이즈 확인",
    "subCategories": [
      {
        "name": "기본 레시피",
        "recipes": [
          {
            "no": 1,
            "name": "초코프라페(자바칩)",
            "steps": [
              {
                "name": "우유",
                "capacity": "100g",
                "etcName": "자바칩 파우더 3S(45g) . 초코소스 2P (60ml) . 얼음 350g",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "MIX 후, 컵 벽면에 초코소스 두르고, 휘핑크림(초코소스 Z드리즐)",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 2,
            "name": "초코프라페(딸기)",
            "steps": [
              {
                "name": "우유",
                "capacity": "100g",
                "etcName": "바닐라 파우더 2S(30g) . 딸기퓨레 2P (60ml) . 얼음 350g",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "MIX 후, 컵 벽면에 초코소스 두르고, 휘핑크림(초코소스 Z드리즐)",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 3,
            "name": "초코프라페(말차)",
            "steps": [
              {
                "name": "우유",
                "capacity": "100g",
                "etcName": "바닐라 파우더 2S(30g) . 말차 액상 시럽 50ml . 얼음 350g",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "MIX 후, 컵 벽면에 초코소스 두르고, 휘핑크림(초코소스 Z드리즐)",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 4,
            "name": "초당옥수수프라페",
            "steps": [
              {
                "name": "우유",
                "capacity": "100g",
                "etcName": "초당옥수수퓨레 70ml . 얼음 350g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 5,
            "name": "오레오프라페",
            "steps": [
              {
                "name": "우유",
                "capacity": "120g",
                "etcName": "쿠키앤크림 파우더 3S(45g) . 초코소스 1P (30ml) . 얼음 350g . MIX",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "쿠키분태 토핑 30g",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 6,
            "name": "메로나프라페",
            "steps": [
              {
                "name": "우유",
                "capacity": "150g",
                "etcName": "멜론 파우더 3S(45g) . 카페시럽 2P (20ml) . 얼음 350g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 7,
            "name": "바나나프라페",
            "steps": [
              {
                "name": "우유",
                "capacity": "150g",
                "etcName": "바나나 파우더 3S(45g) . 카페시럽 2P (20ml) . 얼음 350g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          }
        ]
      }
    ]
  },
  {
    "name": "120겹파이 음료 기본 용량 (ICE)",
    "subCategories": [
      {
        "name": "COFFEE 카테고리 (종이컵 32oz) * 사이즈 확인",
        "recipes": [
          {
            "no": 1,
            "name": "아메리카노",
            "steps": [
              {
                "name": "물",
                "capacity": "300g",
                "etcName": "얼음가득(550g) . 에스프레소 4샷",
                "etcCapacity": "4샷"
              }
            ],
            "note": ""
          },
          {
            "no": 2,
            "name": "카페라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "300g",
                "etcName": "얼음가득(550g) . 에스프레소 4샷",
                "etcCapacity": "4샷"
              }
            ],
            "note": ""
          },
          {
            "no": 3,
            "name": "원라떼(10oz/296ml)",
            "steps": [
              {
                "name": "얼음가득(100g) . 우유80g . 에스프레소 1샷",
                "capacity": "",
                "etcName": "",
                "etcCapacity": "1샷"
              },
              {
                "name": "생크림360g, 연유72g, 버터스카치 시럽18g(약 12회 분량) 핸드믹서로 MIX(요거트 농도 2~5분 내 종료)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "원라떼크림 30g"
          },
          {
            "no": 4,
            "name": "바닐라라떼",
            "steps": [
              {
                "name": "[바닐라 파우더 4S(60g) . 에스크레소 2샷 MIX] . 얼음가득(550g)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": "2샷"
              },
              {
                "name": "우유300g",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 5,
            "name": "카페모카",
            "steps": [
              {
                "name": "[초코소스 3P(90ml) . 에스프레소 2샷 MIX] . 얼음가득(550g)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": "2샷"
              },
              {
                "name": "우유200g",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "휘핑크림                   (초코소스Z 드리즐)"
          },
          {
            "no": 6,
            "name": "카라멜라떼",
            "steps": [
              {
                "name": "[카라멜소스 60g . 에스프레소 2샷 MIX] . 얼음가득(550g)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": "2샷"
              },
              {
                "name": "우유300g",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "휘핑크림                  (카라멜소스Z 드리즐)"
          },
          {
            "no": 7,
            "name": "돌체라떼",
            "steps": [
              {
                "name": "[연유 80g . 에스프레소 2샷 MIX] . 얼음가득(550g)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": "2샷"
              },
              {
                "name": "우유300g",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 8,
            "name": "아샷추",
            "steps": [
              {
                "name": "[아이스티 파우더 5S(75g) . 뜨거운물 100g MIX] . 얼음가득(550g)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": "2샷"
              },
              {
                "name": "물 300g",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "에스크레소 2샷\n(아이스티+샷추가)"
          }
        ]
      }
    ]
  },
  {
    "name": "COLD BREW 카테고리 (32oz) * 사이즈 확인",
    "subCategories": [
      {
        "name": "기본 레시피",
        "recipes": [
          {
            "no": 1,
            "name": "콜드브루",
            "steps": [
              {
                "name": "물",
                "capacity": "160g",
                "etcName": "콜드부르 원액",
                "etcCapacity": "200g"
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 2,
            "name": "콜드브루라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "160g",
                "etcName": "콜드부르 원액",
                "etcCapacity": "200g"
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 3,
            "name": "디카페인 콜드브루",
            "steps": [
              {
                "name": "물",
                "capacity": "160g",
                "etcName": "디카페인 콜드브루 원액",
                "etcCapacity": "200g"
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 4,
            "name": "디카페인 콜드브루 라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "160g",
                "etcName": "디카페인 콜드브루 원액",
                "etcCapacity": "200g"
              }
            ],
            "note": "얼음가득(550g)"
          }
        ]
      }
    ]
  },
  {
    "name": "NON . COFFEE LATTE 카테고리 (32oz) * 사이즈 확인",
    "subCategories": [
      {
        "name": "기본 레시피",
        "recipes": [
          {
            "no": 1,
            "name": "리얼 딸기라떼(ICE)",
            "steps": [
              {
                "name": "우유",
                "capacity": "300g",
                "etcName": "딸기청 150g . 카페시럽 3P (30ml)",
                "etcCapacity": ""
              }
            ],
            "note": "얼음가득(550g)\n딸기청 제조 : 냉동딸기 1kg (완전히 해동) . 백설탕 300g 블렌더 MIX (알갱이가 보이도록)"
          },
          {
            "no": 2,
            "name": "초당옥수수라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "300g",
                "etcName": "초당옥수수 퓨레",
                "etcCapacity": "100g"
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 3,
            "name": "말차라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "300g",
                "etcName": "말차 액상 시럽",
                "etcCapacity": "100g"
              },
              {
                "name": "* 초코소스 추가 + 60g (말차라떼 제조 후, 초코소스 드리즐)                                                        * 샷 추가 + 에스프레소 2샷 (말차라떼 제조 후, 위에 부어주기)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 4,
            "name": "리얼 고구마라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "300g",
                "etcName": "고구마 페이스트",
                "etcCapacity": "100g"
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 5,
            "name": "미숫가루(ICE)",
            "steps": [
              {
                "name": "미숫가루 5S (75g) . 카세시럽 5P (50ml) . 우유 500ml 블렌더 MIX",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              },
              {
                "name": "핸드믹서로 간편 사용 가능!",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 6,
            "name": "초코라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "300g",
                "etcName": "초코소스",
                "etcCapacity": "4P (120ml)"
              }
            ],
            "note": "휘핑크림                   (초코소스 Z드리즐)"
          },
          {
            "no": 7,
            "name": "바닐라라떼(ICE)",
            "steps": [
              {
                "name": "우유",
                "capacity": "300g",
                "etcName": "바나나 파우더",
                "etcCapacity": "5S (75g)"
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 8,
            "name": "메로나라떼(ICE)",
            "steps": [
              {
                "name": "우유",
                "capacity": "300g",
                "etcName": "멜론 파우더",
                "etcCapacity": "5S (75g)"
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 9,
            "name": "피스타치오라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "300g",
                "etcName": "피스타치오 파우더",
                "etcCapacity": "5S (75g)"
              }
            ],
            "note": "얼음가득(550g)"
          }
        ]
      }
    ]
  },
  {
    "name": "MILK TEA 카테고리 (32oz) * 사이즈 확인",
    "subCategories": [
      {
        "name": "기본 레시피",
        "recipes": [
          {
            "no": 1,
            "name": "얼그레이홍차밀크티",
            "steps": [
              {
                "name": "우유",
                "capacity": "300g",
                "etcName": "밀크티 파우더",
                "etcCapacity": "5S (75g)"
              },
              {
                "name": "타피오카펄 1팩 전자레인지 1분 30초 / 타피오카펄 2팩 전자레인지 3분 30초",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "펄 제공(1팩)"
          },
          {
            "no": 2,
            "name": "타로밀크티",
            "steps": [
              {
                "name": "우유",
                "capacity": "300g",
                "etcName": "타로 파우더",
                "etcCapacity": "5S (75g)"
              },
              {
                "name": "타피오카펄 1팩 전자레인지 1분 30초 / 타피오카펄 2팩 전자레인지 3분 30초",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "펄 제공(1팩)"
          }
        ]
      }
    ]
  },
  {
    "name": "TEA 카테고리 (32oz) * 사이즈 확인",
    "subCategories": [
      {
        "name": "기본 레시피",
        "recipes": [
          {
            "no": 1,
            "name": "복숭아아이스티",
            "steps": [
              {
                "name": "얼음가득 (550g) . [복숭아 아이스티 파우더 5S (75g) . 뜨거운물 200g MIX] -> 추가얼음",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "뜨거운물 200g"
          },
          {
            "no": 2,
            "name": "레몬아이스티",
            "steps": [
              {
                "name": "물",
                "capacity": "300g",
                "etcName": "레몬아이스트 시럽",
                "etcCapacity": "4P (120ml)"
              }
            ],
            "note": ""
          },
          {
            "no": 3,
            "name": "석류아이스티",
            "steps": [
              {
                "name": "얼음가득 (550g) . [석류 아이스티 파우더 5S (75g) . 뜨거운물 200g MIX] -> 추가얼음",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "뜨거운물 200g"
          },
          {
            "no": 4,
            "name": "제로아이스티",
            "steps": [
              {
                "name": "물",
                "capacity": "300g",
                "etcName": "제로아이스티 시럽",
                "etcCapacity": "100ml"
              }
            ],
            "note": ""
          },
          {
            "no": 5,
            "name": "달콤티(유자/자몽)",
            "steps": [
              {
                "name": "얼음가득 (550g) . [유자/자몽청 100g . 뜨거운물 200g MIX] -> 추가얼음",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "뜨거운물 200g"
          },
          {
            "no": 6,
            "name": "달콤티(레몬)",
            "steps": [
              {
                "name": "얼음가득 (550g) . [레몬청 110g . 뜨거운물 200g MIX] -> 추가얼음",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "레몬슬라이스 5개 포함"
          },
          {
            "no": 7,
            "name": "허브티",
            "steps": [
              {
                "name": "티백",
                "capacity": "2",
                "etcName": "얼음가득 (550g) . [허브차티백2개 . 뜨거운물 200g MIX] -> 추가얼음",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "(얼그레이/캐모마일/페퍼민트/히비스커스)",
                "etcCapacity": ""
              }
            ],
            "note": "(계량컵)"
          },
          {
            "no": 8,
            "name": "오렌지자몽블랙티",
            "steps": [
              {
                "name": "티백 . 말린과일",
                "capacity": "2",
                "etcName": "얼음가득 (550g) . [오렌지자몽블랙티 티백2개 . 뜨거운물 200g MIX] -> 추가얼음",
                "etcCapacity": ""
              }
            ],
            "note": "말린과일 2개\n(계량컵)"
          },
          {
            "no": 9,
            "name": "레몬얼그레이티",
            "steps": [
              {
                "name": "티백 . 말린과일",
                "capacity": "2",
                "etcName": "얼음가득 (550g) . [레몬얼그레이티 티백2개 .   뜨거운물 200g MIX] -> 추가얼음",
                "etcCapacity": ""
              }
            ],
            "note": "말린과일 2개\n(계량컵)"
          }
        ]
      }
    ]
  },
  {
    "name": "ADE 카테고리 (32oz) * 사이즈 확인",
    "subCategories": [
      {
        "name": "기본 레시피",
        "recipes": [
          {
            "no": 1,
            "name": "체리콕",
            "steps": [
              {
                "name": "콜라",
                "capacity": "355ml",
                "etcName": "체리농축액 100ml . 카페시럽 2P (20ml)",
                "etcCapacity": ""
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 2,
            "name": "자두복숭아에이드",
            "steps": [
              {
                "name": "탄산수",
                "capacity": "300ml",
                "etcName": "자두복숭아 퓨레",
                "etcCapacity": "100ml"
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 3,
            "name": "제주한라봉에이드",
            "steps": [
              {
                "name": "탄산수",
                "capacity": "300ml",
                "etcName": "한라봉 퓨레 100ml . 카페시럽 2P (20ml)",
                "etcCapacity": ""
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 4,
            "name": "샤인머스켓에이드",
            "steps": [
              {
                "name": "탄산수",
                "capacity": "300ml",
                "etcName": "샤인머스켓 퓨레",
                "etcCapacity": "100ml"
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 5,
            "name": "자몽에이드",
            "steps": [
              {
                "name": "탄산수",
                "capacity": "300ml",
                "etcName": "자몽 농축액 100ml . 카페시럽 2P (20ml)",
                "etcCapacity": ""
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 6,
            "name": "레몬에이드",
            "steps": [
              {
                "name": "탄산수",
                "capacity": "300ml",
                "etcName": "레몬청 (슬라이스 5개 포함)",
                "etcCapacity": "110g"
              }
            ],
            "note": "얼음가득(550g)"
          }
        ]
      }
    ]
  },
  {
    "name": "SMOOTHIE 카테고리 (32oz) * 사이즈 확인",
    "subCategories": [
      {
        "name": "기본 레시피",
        "recipes": [
          {
            "no": 1,
            "name": "캔디바소다스무디",
            "steps": [
              {
                "name": "물, 우유",
                "capacity": "125g / 125g",
                "etcName": "소다 파우더 5S (75g) . 얼음 600g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 2,
            "name": "자두복숭아스무디",
            "steps": [
              {
                "name": "물",
                "capacity": "250g",
                "etcName": "자두복숭아퓨레 100ml . 얼음 600g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 3,
            "name": "탱크보이스무디",
            "steps": [
              {
                "name": "물",
                "capacity": "250g",
                "etcName": "배 퓨레 6P(180ml) . 얼음 600g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 4,
            "name": "딸기스무디",
            "steps": [
              {
                "name": "물",
                "capacity": "250g",
                "etcName": "딸기퓨레 6P(180ml) . 냉동딸기 5알 .  얼음 600g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 5,
            "name": "한라봉스무디",
            "steps": [
              {
                "name": "물",
                "capacity": "250g",
                "etcName": "한라봉퓨레 100ml . 카페시럽 3P(30ml) .  얼음 600g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 6,
            "name": "콩커피코코넛스무디",
            "steps": [
              {
                "name": "우유",
                "capacity": "200g",
                "etcName": "코코넛 퓨레 100ml . 연유 50ml . 얼음 550g . MIX",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "에스프레소 2샷",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 1,
            "name": "플레인 요거트스무디",
            "steps": [
              {
                "name": "우유",
                "capacity": "250g",
                "etcName": "요거트 파우더 5S (75g) . 카페시럽 3P(30ml) .  얼음 550g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 2,
            "name": "딸기 요거트스무디",
            "steps": [
              {
                "name": "우유",
                "capacity": "250g",
                "etcName": "요거트 파우더 5S (75g) . 딸기퓨레 4P(120ml) . 냉동딸기5알 .              얼음 550g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 3,
            "name": "블루베리 요거트스무디",
            "steps": [
              {
                "name": "우유",
                "capacity": "250g",
                "etcName": "요거트 파우더 5S (75g) . 딸기퓨레 2P(20ml) . 냉동블루베리30알 .        얼음 550g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          }
        ]
      }
    ]
  },
  {
    "name": "FRAFFE 카테고리 (32oz) * 사이즈 확인",
    "subCategories": [
      {
        "name": "기본 레시피",
        "recipes": [
          {
            "no": 1,
            "name": "초코프라페(자바칩)",
            "steps": [
              {
                "name": "우유",
                "capacity": "200g",
                "etcName": "자바칩 파우더 5S(75g) . 초코소스 2P (60ml) . 얼음 550g",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "MIX 후, 컵 벽면에 초코소스 두르고, 휘핑크림(초코소스 Z드리즐)",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 2,
            "name": "초코프라페(딸기)",
            "steps": [
              {
                "name": "우유",
                "capacity": "200g",
                "etcName": "바닐라 파우더 4S(60g) . 딸기퓨레 4P (120ml) . 얼음 550g",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "MIX 후, 컵 벽면에 초코소스 두르고, 휘핑크림(초코소스 Z드리즐)",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 3,
            "name": "초코프라페(말차)",
            "steps": [
              {
                "name": "우유",
                "capacity": "200g",
                "etcName": "바닐라 파우더 4S(60g) . 말차 액상 시럽 80ml . 얼음 550g",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "MIX 후, 컵 벽면에 초코소스 두르고, 휘핑크림(초코소스 Z드리즐)",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 4,
            "name": "초당옥수수프라페",
            "steps": [
              {
                "name": "우유",
                "capacity": "200g",
                "etcName": "초당옥수수퓨레 100ml . 얼음 550g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 5,
            "name": "오레오프라페",
            "steps": [
              {
                "name": "우유",
                "capacity": "250g",
                "etcName": "쿠키앤크림 파우더 5S(75g) . 초코소스 2P (60ml) . 얼음 550g . MIX",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "쿠키분태 토핑 30g",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 6,
            "name": "메로나프라페",
            "steps": [
              {
                "name": "우유",
                "capacity": "250g",
                "etcName": "멜론 파우더 5S(75g) . 카페시럽 3P (30ml) . 얼음 550g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 7,
            "name": "바나나프라페",
            "steps": [
              {
                "name": "우유",
                "capacity": "250g",
                "etcName": "바나나 파우더 5S(75g) . 카페시럽 3P (30ml) . 얼음 550g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          }
        ]
      }
    ]
  },
  {
    "name": "120겹파이 음료 모틀 용량 (ICE)",
    "subCategories": []
  },
  {
    "name": "COFFEE 카테고리 (1.1L) * 사이즈 확인",
    "subCategories": [
      {
        "name": "기본 레시피",
        "recipes": [
          {
            "no": 1,
            "name": "아메리카노",
            "steps": [
              {
                "name": "물",
                "capacity": "350g",
                "etcName": "얼음가득(550g) . 에스프레소 4샷",
                "etcCapacity": "4샷"
              }
            ],
            "note": ""
          },
          {
            "no": 2,
            "name": "카페라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "350g",
                "etcName": "얼음가득(550g) . 에스프레소 4샷",
                "etcCapacity": "4샷"
              }
            ],
            "note": ""
          },
          {
            "no": 3,
            "name": "바닐라라떼",
            "steps": [
              {
                "name": "[바닐라 파우더 4S(60g) . 에스프레소3샷MIX] . 얼음가득(550g)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": "3샷"
              },
              {
                "name": "우유350g",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 4,
            "name": "카페모카",
            "steps": [
              {
                "name": "[초코소스3P(90ml) . 에스프레소3샷MIX] . 얼음가득(550g)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": "3샷"
              },
              {
                "name": "우유350g",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "휘핑크림                   (초코소스Z드리즐)"
          },
          {
            "no": 5,
            "name": "밀크카라멜라떼",
            "steps": [
              {
                "name": "[카라멜소스 60g . 에스프레소3샷MIX] . 얼음가득(550g)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": "3샷"
              },
              {
                "name": "우유350g",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "휘핑크림                  (카라멜소스Z드리즐)"
          },
          {
            "no": 6,
            "name": "돌체라떼",
            "steps": [
              {
                "name": "[연유 80ml . 에스프레소3샷MIX] . 얼음가득(550g)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": "3샷"
              },
              {
                "name": "우유350g",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 7,
            "name": "아샷추",
            "steps": [
              {
                "name": "[아이스티 파우더 5S(75g) . 뜨거운물 200gMIX] . 얼음가득(550g)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": "2샷"
              },
              {
                "name": "뜨거운물 200g",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "에스프레소 2샷\n(아이스티 + 샷추가)"
          }
        ]
      }
    ]
  },
  {
    "name": "COLD BREW 카테고리 (1.1L) * 사이즈 확인",
    "subCategories": [
      {
        "name": "기본 레시피",
        "recipes": [
          {
            "no": 1,
            "name": "콜드브루",
            "steps": [
              {
                "name": "물",
                "capacity": "250g",
                "etcName": "콜드브루 원액",
                "etcCapacity": "250"
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 2,
            "name": "콜드브루라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "250g",
                "etcName": "콜드브루 원액",
                "etcCapacity": "250"
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 3,
            "name": "디카페인 콜드브루",
            "steps": [
              {
                "name": "물",
                "capacity": "250g",
                "etcName": "디카페인 콜드브루 원랙",
                "etcCapacity": "250"
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 4,
            "name": "디카페인 콜드브루라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "250g",
                "etcName": "디카페인 콜드브루 원랙",
                "etcCapacity": "250"
              }
            ],
            "note": "얼음가득(550g)"
          }
        ]
      }
    ]
  },
  {
    "name": "NON . COFFEE LATTE 카테고리 (1.1L) * 사이즈 확인",
    "subCategories": [
      {
        "name": "기본 레시피",
        "recipes": [
          {
            "no": 1,
            "name": "리얼 딸기라떼(ICE)",
            "steps": [
              {
                "name": "우유",
                "capacity": "350g",
                "etcName": "딸기청 170g . 카페시럽 4P (30ml)",
                "etcCapacity": ""
              }
            ],
            "note": "얼음가득(550g)\n딸기청 제조 : 냉동딸기 1kg (완전히 해동) . 백설탕 300g 블렌더 MIX (알갱이가 보이도록)"
          },
          {
            "no": 2,
            "name": "초당옥수수라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "400g",
                "etcName": "초당옥수수 퓨레",
                "etcCapacity": "130"
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 3,
            "name": "말차라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "400g",
                "etcName": "말차 액상 시럽",
                "etcCapacity": "130"
              },
              {
                "name": "* 초코소스 추가 + 70g (말차라떼 제조 후, 초코소스 드리즐)                                                        * 샷 추가 + 에스프레소 2샷 (말차라떼 제조 후, 위에 부어주기)",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 4,
            "name": "리얼 고구마라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "350g",
                "etcName": "고구마 페이스트",
                "etcCapacity": "120"
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 5,
            "name": "미숫가루(ICE)",
            "steps": [
              {
                "name": "미숫가루 5S (75g) . 카세시럽 5P (50ml) . 우유 500ml 블렌더 MIX",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              },
              {
                "name": "핸드믹서로 간편 사용 가능!",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 6,
            "name": "초코라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "400g",
                "etcName": "초코소스",
                "etcCapacity": "5P (150ml)"
              }
            ],
            "note": "휘칭크림                   (초코소스 Z드리즐)"
          },
          {
            "no": 7,
            "name": "바닐라라떼(ICE)",
            "steps": [
              {
                "name": "우유",
                "capacity": "350g",
                "etcName": "바나나 파우더6S (90g) . 뜨거운물 100g MIX",
                "etcCapacity": ""
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 8,
            "name": "메로나라떼(ICE)",
            "steps": [
              {
                "name": "우유",
                "capacity": "350g",
                "etcName": "멜론 파우더6S (90g) . 뜨거운물 100g MIX",
                "etcCapacity": ""
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 9,
            "name": "피스타치오라떼",
            "steps": [
              {
                "name": "우유",
                "capacity": "350g",
                "etcName": "피스타치오 파우더6S (90g) . 뜨거운물 100g MIX",
                "etcCapacity": ""
              }
            ],
            "note": "얼음가득(550g)"
          }
        ]
      }
    ]
  },
  {
    "name": "MILK TEA 카테고리 (1.1L) * 사이즈 확인",
    "subCategories": [
      {
        "name": "기본 레시피",
        "recipes": [
          {
            "no": 1,
            "name": "얼그레이홍차밀크티",
            "steps": [
              {
                "name": "우유",
                "capacity": "350g",
                "etcName": "밀크티 파우더",
                "etcCapacity": "6S (90g)"
              },
              {
                "name": "타피오카펄 1팩 전자레인지 1분 30초 / 타피오카펄 2팩 전자레인지 3분 30초",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "ICE(펄ㅇ)선택 시,         타피오카 펄 2팩 제공"
          },
          {
            "no": 2,
            "name": "타로밀크티",
            "steps": [
              {
                "name": "우유",
                "capacity": "350g",
                "etcName": "타로 파우더",
                "etcCapacity": "6S (90g)"
              },
              {
                "name": "타피오카펄 1팩 전자레인지 1분 30초 / 타피오카펄 2팩 전자레인지 3분 30초",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "ICE(펄ㅇ)선택 시,         타피오카 펄 2팩 제공"
          }
        ]
      }
    ]
  },
  {
    "name": "TEA 카테고리 (1.1L) * 사이즈 확인",
    "subCategories": [
      {
        "name": "기본 레시피",
        "recipes": [
          {
            "no": 1,
            "name": "복숭아아이스티",
            "steps": [
              {
                "name": "얼음가득 (480g) . [복숭아 아이스티 파우더 7S (105g) . 뜨거운물 300g MIX] -> 추가얼음",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "뜨거운물 300g"
          },
          {
            "no": 2,
            "name": "레몬아이스티",
            "steps": [
              {
                "name": "물",
                "capacity": "400g",
                "etcName": "레몬아이스트 시럽",
                "etcCapacity": "5P (150ml)"
              }
            ],
            "note": ""
          },
          {
            "no": 3,
            "name": "석류아이스티",
            "steps": [
              {
                "name": "얼음가득 (480g) . [석류 아이스티 파우더 7S (105g) . 뜨거운물 300g MIX] -> 추가얼음",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "뜨거운물 300g"
          },
          {
            "no": 4,
            "name": "제로아이스티",
            "steps": [
              {
                "name": "물",
                "capacity": "400g",
                "etcName": "제로아이스티 시럽",
                "etcCapacity": "130ml"
              }
            ],
            "note": ""
          },
          {
            "no": 5,
            "name": "달콤티(유자/자몽)",
            "steps": [
              {
                "name": "얼음가득 (480g) . [유자/자몽청 130g . 뜨거운물 300g MIX] -> 추가얼음",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "뜨거운물 300g"
          },
          {
            "no": 6,
            "name": "달콤티(레몬)",
            "steps": [
              {
                "name": "얼음가득 (480g) . [레몬청 140g . 뜨거운물 300g MIX] -> 추가얼음",
                "capacity": "",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": "레몬슬라이스 5개 포함"
          },
          {
            "no": 7,
            "name": "허브티",
            "steps": [
              {
                "name": "티백",
                "capacity": "2",
                "etcName": "얼음가득 (480g) . [허브차티백2개 . 뜨거운물 300g MIX] -> 추가얼음",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "(얼그레이/캐모마일/페퍼민트/히비스커스)",
                "etcCapacity": ""
              }
            ],
            "note": "(계량컵)"
          },
          {
            "no": 8,
            "name": "오렌지자몽블랙티",
            "steps": [
              {
                "name": "티백 . 말린과일",
                "capacity": "2",
                "etcName": "얼음가득 (480g) . [오렌지자몽블랙티 티백2개 . 뜨거운물 300g MIX] -> 추가얼음",
                "etcCapacity": ""
              }
            ],
            "note": "말린과일 2개\n(계량컵)"
          },
          {
            "no": 9,
            "name": "레몬얼그레이티",
            "steps": [
              {
                "name": "티백 . 말린과일",
                "capacity": "2",
                "etcName": "얼음가득 (480g) . [레몬얼그레이티 티백2개 . 뜨거운물 300g MIX] -> 추가얼음",
                "etcCapacity": ""
              }
            ],
            "note": "말린과일 2개\n(계량컵)"
          }
        ]
      }
    ]
  },
  {
    "name": "ADE 카테고리 (1.1L) * 사이즈 확인",
    "subCategories": [
      {
        "name": "기본 레시피",
        "recipes": [
          {
            "no": 1,
            "name": "체리콕",
            "steps": [
              {
                "name": "콜라",
                "capacity": "355ml",
                "etcName": "체리농축액 130ml . 카페시럽 2P (30ml)",
                "etcCapacity": ""
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 2,
            "name": "자두복숭아에이드",
            "steps": [
              {
                "name": "탄산수",
                "capacity": "400ml",
                "etcName": "자두복숭아 퓨레",
                "etcCapacity": "130ml"
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 3,
            "name": "제주한라봉에이드",
            "steps": [
              {
                "name": "탄산수",
                "capacity": "400ml",
                "etcName": "한라봉 퓨레 130ml . 카페시럽 3P (30ml)",
                "etcCapacity": ""
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 4,
            "name": "샤인머스켓에이드",
            "steps": [
              {
                "name": "탄산수",
                "capacity": "400ml",
                "etcName": "샤인머스켓 퓨레",
                "etcCapacity": "130ml"
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 5,
            "name": "자몽에이드",
            "steps": [
              {
                "name": "탄산수",
                "capacity": "400ml",
                "etcName": "자몽 농축액 130ml . 카페시럽 3P (30ml)",
                "etcCapacity": ""
              }
            ],
            "note": "얼음가득(550g)"
          },
          {
            "no": 6,
            "name": "레몬에이드",
            "steps": [
              {
                "name": "탄산수",
                "capacity": "400ml",
                "etcName": "레몬청 (슬라이스 5개 포함)",
                "etcCapacity": "140g"
              }
            ],
            "note": "얼음가득(550g)"
          }
        ]
      }
    ]
  },
  {
    "name": "SMOOTHIE 카테고리 (1.1L) * 사이즈 확인",
    "subCategories": [
      {
        "name": "기본 레시피",
        "recipes": [
          {
            "no": 1,
            "name": "캔디바소다스무디",
            "steps": [
              {
                "name": "물, 우유",
                "capacity": "150g / 150g",
                "etcName": "소다 파우더 6S (90g) . 얼음 700g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 2,
            "name": "자두복숭아스무디",
            "steps": [
              {
                "name": "물",
                "capacity": "300g",
                "etcName": "자두복숭아퓨레 130ml . 얼음 700g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 3,
            "name": "탱크보이스무디",
            "steps": [
              {
                "name": "물",
                "capacity": "300g",
                "etcName": "배 퓨레 7P(210ml) . 얼음 700g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 4,
            "name": "딸기스무디",
            "steps": [
              {
                "name": "물",
                "capacity": "300g",
                "etcName": "딸기퓨레 7P(210ml) . 냉동딸기 6알 .  얼음 700g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 5,
            "name": "한라봉스무디",
            "steps": [
              {
                "name": "물",
                "capacity": "300g",
                "etcName": "한라봉퓨레 130ml . 카페시럽 4P(40ml) .  얼음 700g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 6,
            "name": "콩커피코코넛스무디",
            "steps": [
              {
                "name": "우유",
                "capacity": "300g",
                "etcName": "코코넛 퓨레 130ml . 연유 70ml . 얼음 650g . MIX",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "에스프레소 2샷",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 1,
            "name": "플레인 요거트스무디",
            "steps": [
              {
                "name": "우유",
                "capacity": "300g",
                "etcName": "요거트 파우더 6S (90g) . 카페시럽 4P(30ml) .  얼음 650g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 2,
            "name": "딸기 요거트스무디",
            "steps": [
              {
                "name": "우유",
                "capacity": "300g",
                "etcName": "요거트 파우더 6S (90g) . 딸기퓨레 4P(150ml) . 냉동딸기6알 .               얼음 650g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 3,
            "name": "블루베리 요거트스무디",
            "steps": [
              {
                "name": "우유",
                "capacity": "300g",
                "etcName": "요거트 파우더 6S (90g) . 카페시럽4P (40ml) . 냉동블루베리40알 .          얼음 550g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          }
        ]
      }
    ]
  },
  {
    "name": "FRAFFE 카테고리 (1.1L) * 사이즈 확인",
    "subCategories": [
      {
        "name": "기본 레시피",
        "recipes": [
          {
            "no": 1,
            "name": "초코프라페(자바칩)",
            "steps": [
              {
                "name": "우유",
                "capacity": "300g",
                "etcName": "자바칩 파우더 6S(90g) . 초코소스 3P (90ml) . 얼음 650g",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "MIX 후, 컵 벽면에 초코소스 두르고, 휘핑크림(초코소스 Z드리즐)",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 2,
            "name": "초코프라페(딸기)",
            "steps": [
              {
                "name": "우유",
                "capacity": "300g",
                "etcName": "바닐라 파우더 5S(75g) . 딸기퓨레 5P (150ml) . 얼음 650g",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "MIX 후, 컵 벽면에 초코소스 두르고, 휘핑크림(초코소스 Z드리즐)",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 3,
            "name": "초코프라페(말차)",
            "steps": [
              {
                "name": "우유",
                "capacity": "300g",
                "etcName": "바닐라 파우더 5S(75g) . 말차 액상 시럽 100ml . 얼음 650g",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "MIX 후, 컵 벽면에 초코소스 두르고, 휘핑크림(초코소스 Z드리즐)",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 4,
            "name": "초당옥수수프라페",
            "steps": [
              {
                "name": "우유",
                "capacity": "300g",
                "etcName": "초당옥수수퓨레 130ml . 얼음 650g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 5,
            "name": "오레오프라페",
            "steps": [
              {
                "name": "우유",
                "capacity": "300g",
                "etcName": "쿠키앤크림 파우더 6S(90g) . 초코소스 3P (90ml) . 얼음 650g . MIX",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "쿠키분태 토핑 50g",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 6,
            "name": "메로나프라페",
            "steps": [
              {
                "name": "우유",
                "capacity": "300g",
                "etcName": "멜론 파우더 6S(90g) . 카페시럽 4P (40ml) . 얼음 650g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 7,
            "name": "바나나프라페",
            "steps": [
              {
                "name": "우유",
                "capacity": "300g",
                "etcName": "바나나 파우더 6S(90g) . 카페시럽 4P (40ml) . 얼음 650g . MIX",
                "etcCapacity": ""
              }
            ],
            "note": ""
          }
        ]
      }
    ]
  },
  {
    "name": "120겹파이 디저트 기본 용량 (와플, 크로플)",
    "subCategories": [
      {
        "name": "WAFFLF 카테고리 (디저트)",
        "recipes": [
          {
            "no": 1,
            "name": "와플 굽는 방법",
            "steps": [
              {
                "name": "180~200도 유지(200도 이상 사용금지!)",
                "capacity": "",
                "etcName": "1. 전원을 켠 후, 예열을 시켜준다.(빨간점등 확인, 약 20분 소요!)",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 기계에 와플반죽 150g을 붓는다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "3. 3분 구워낸 후, 식힘망에서 선풍기로 말려준다.",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 2,
            "name": "와플 제조 레시피",
            "steps": [
              {
                "name": "(생크림 와플)",
                "capacity": "",
                "etcName": "1. 와플반죽 150g을 와플기계에 구워서 준비한다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 한쪽면에 생크림 50g을 올려준다.",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 3,
            "name": "애플잼 와플",
            "steps": [
              {
                "name": "",
                "capacity": "",
                "etcName": "1. 와플전체에 사과잼 30g을 Z드리즐 한다.",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 4,
            "name": "누텔라 범벅 와플",
            "steps": [
              {
                "name": "",
                "capacity": "",
                "etcName": "1. 다른 한쪽면에 누텔라 잼 30g을 펴 발라준다.",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 5,
            "name": "로투스 와플",
            "steps": [
              {
                "name": "",
                "capacity": "",
                "etcName": "1. 다른 한쪽면에 로투스 잼 30g을 펴 발라준다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 생크림을 올린 면에 로투스 크럼블 20g을 토핑 해준다.",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 6,
            "name": "초코에 빠진 쿠키 와플",
            "steps": [
              {
                "name": "",
                "capacity": "",
                "etcName": "1. 와플 전체에 초코소스 15g을 Z드리즐 한다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 생크림을 올린 면에 쿠키 분태 20g을 토핑 해준다.",
                "etcCapacity": ""
              }
            ],
            "note": ""
          }
        ]
      },
      {
        "name": "CROISSANT WAFFLE 카테고리 (디저트)",
        "recipes": [
          {
            "no": 1,
            "name": "크로플 굽는 방법",
            "steps": [
              {
                "name": "180~200도 유지(200도 이상 사용금지!)",
                "capacity": "",
                "etcName": "1. 전원을 켠 후, 예열을 시켜준다.(빨간점등 확인, 약 20분 소요!)",
                "etcCapacity": ""
              },
              {
                "name": "(플레인 크로플)",
                "capacity": "",
                "etcName": "2. 실온을 해동된 크로와상 생지를 설탕(황설탕+백설탕)에 고루 묻혀 준다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "3. 예열된 판에 2분, 뒤집어서 2분 총 4분 구워낸다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "4. 식힘망에서 선풍기로 바삭하게 말려준다.",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 2,
            "name": "체다 치즈 크로플",
            "steps": [
              {
                "name": "",
                "capacity": "",
                "etcName": "1. 슬라이스 치즈한장을 올리고 요리용 토치로 살짝 녹요준다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 파슬리 토핑 해준다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "(토치가 없을시, 전자레인지에 20초 치즈를 녹여준 후, 파슬리 토핑)",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 3,
            "name": "라즈베리 생크림 크로플",
            "steps": [
              {
                "name": "",
                "capacity": "",
                "etcName": "1. 크로플 위에 생크림 50g Z드리즐 해준다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 생크림 위에 라즈베리 잼 25g 토핑 해준다.",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 4,
            "name": "누텔라 생크림 크로플",
            "steps": [
              {
                "name": "",
                "capacity": "",
                "etcName": "1. 크로플 위에 생크림 50g Z드리즐 해준다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 생크림 위에 누텔라 잼(소스통) 15g Z드리즐 해준다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "3. 땅콩 5g 토핑 해준다. (옵션에서 땅콩제외 선택시, 생략)",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 5,
            "name": "로투스 생크림 크로플",
            "steps": [
              {
                "name": "",
                "capacity": "",
                "etcName": "1. 크로플 위에 생크림 50g Z드리즐 해준다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 생크림 위에 로투스 잼(소스통) 15g Z드리즐 해준다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "3. 로투스 크럼블 10g 토핑 해준다.",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 6,
            "name": "(시즌)딸기 생크림 크로플",
            "steps": [
              {
                "name": "",
                "capacity": "",
                "etcName": "1. 크로플 위에 생크림 50g Z드리즐 해준다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 생크림 위에 딸기 리플 잼(소스통) 15g Z드리즐 해준다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "3. 생크림 15g 슬라이스 하여 토핑 해준다.",
                "etcCapacity": ""
              }
            ],
            "note": ""
          }
        ]
      },
      {
        "name": "120겹파이 카테고리 (디저트)",
        "recipes": [
          {
            "no": 1,
            "name": "120겹파이 굽는 방법",
            "steps": [
              {
                "name": "180~200도 유지(200도 이상 사용금지!)",
                "capacity": "",
                "etcName": "1. 전원을 켠 후, 예열을 시켜준다.(빨간점등 확인, 약 10분 소요!)",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 냉동생지와 모짜치즈와 해동된 속재료를 준비한다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "3. 예열된 판에 생지 1장을 올리고 속재료 치즈 토핑후 생지를 덮는다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "4. 상판을 덮고 3~4분 동안 익힌다.",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 2,
            "name": "페페로니 피자파이",
            "steps": [
              {
                "name": "",
                "capacity": "",
                "etcName": "1. 페페로니 6장을 30초 해동한다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 생지를 예열된 판에 올리고 피자소스(10g) 펴 바른다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "3. 페페로니 3장을 소스위에 올린다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "4. 옥수수콘 한스푼 20g 올린다.(생략가능)",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "5. 모짜치즈를 토핑한다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "6. 페페로니 3장을 올리고 생지를 위에 덥고 4분간 굽는다.",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 3,
            "name": "불고기 피자파이",
            "steps": [
              {
                "name": "",
                "capacity": "",
                "etcName": "1. 불고기 토핑 30g 30초 해동한다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 생지를 예열된 판에 올리고 피자소스(10g) 펴 바른다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "3. 불고기 토핑을 소스위에 올린다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "4. 옥수수콘 한스푼 20g 올린다.(생략가능)",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "5. 모짜치즈를 토핑한다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "5. 생지를 덥고 4분간 굽는다",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 4,
            "name": "포테이토 베이컨 피자파이",
            "steps": [
              {
                "name": "",
                "capacity": "",
                "etcName": "1. 매쉬드 포테이토 300g 온수 100g 용기에 섞고 전자레인지 6분 돌린다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 소금2g, 설탕 20g, 후추 3회 톡톡 뿌려 넣고 잘 섞는다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "3. 마요네즈 70g 넣고 섞는다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "4. 생지를 예열된 판에 올리고 피자소스(10g)을 펴 바른다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "5. 소스위에 준비된 메쉬드 포테이토 45g을 올린다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "6. 베이컨 13g을 올린다.(잘라서 사용)",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "7. 모짜치즈를 토핑한다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "8. 생지를 덮고 4분간 굽는다",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 4,
            "name": "고구마 베이컨 피자파이",
            "steps": [
              {
                "name": "",
                "capacity": "",
                "etcName": "1. 고구마무스 45g 30초 해동한다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 생지를 예열된 판에 올리고 피자소스(10g) 펴 바른다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "3. 고구마무스를 소스위에 올린다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "4. 베이컨 13g 올린다. (잘라서 사용)",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "5. 모짜치즈 토핑한다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "6. 생지를 덥고 4분간 굽는다",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 5,
            "name": "꿀호떡파이",
            "steps": [
              {
                "name": "배합",
                "capacity": "호떡믹스 30g",
                "etcName": "1. 생지를 예열된 판에 올리고 배합된 호떡소를 넣는다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "물 30g",
                "etcName": "2. 생지를 덥고 4분간 굽는다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "* 치즈 x",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 6,
            "name": "콘치즈파이",
            "steps": [
              {
                "name": "배합",
                "capacity": "콘 330g",
                "etcName": "1. 생지를 예열된 판에 올리고 배합된 콘치즈소를 넣는다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "마요네즈 50g",
                "etcName": "2. 생지를 덥고 4분간 굽는다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "설탕 50g",
                "etcName": "",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "커스터드가루 100g",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 7,
            "name": "애플파이",
            "steps": [
              {
                "name": "",
                "capacity": "",
                "etcName": "1. 생지를 예열된 판에 올리고 애플필링(25g) 올린다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 모짜치즈(30g)을 토핑한다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "3. 생지를 위에 덥고 4분간 굽는다.",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 7,
            "name": "크림치즈파이",
            "steps": [
              {
                "name": "",
                "capacity": "",
                "etcName": "1. 생지를 예열된 판에 올리고 크림치즈(25g) 올린다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 모짜치즈(30g)을 토핑한다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "3. 생지를 위에 덥고 4분간 굽는다.",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 7,
            "name": "커스터드파이",
            "steps": [
              {
                "name": "배합",
                "capacity": "믹스 15g",
                "etcName": "1. 생지를 예열된 판에 올리고 커스터드크림을 올린다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "물 40g",
                "etcName": "2. 모짜치즈(30g)을 토핑한다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "3. 생지를 위에 덥고 4분간 굽는다.",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 7,
            "name": "블루베리파이",
            "steps": [
              {
                "name": "",
                "capacity": "",
                "etcName": "1. 생지를 예열된 판에 올리고 블루베리소(25g)을 올린다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 모짜치즈(30g)을 토핑한다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "3. 생지를 위에 덥고 4분간 굽는다.",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 7,
            "name": "망고파이",
            "steps": [
              {
                "name": "",
                "capacity": "",
                "etcName": "1. 생지를 예열된 판에 올리고 망고소(25g)을 올린다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 모짜치즈(30g)을 토핑한다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "3. 생지를 위에 덥고 4분간 굽는다.",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 7,
            "name": "고구마파이",
            "steps": [
              {
                "name": "",
                "capacity": "",
                "etcName": "1. 생지를 예열된 판에 올리고 고무마소(25g)을 올린다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 모짜치즈(30g)을 토핑한다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "3. 생지를 위에 덥고 4분간 굽는다.",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 7,
            "name": "직화불고기파이",
            "steps": [
              {
                "name": "",
                "capacity": "",
                "etcName": "1. 생지를 예열된 판에 올리고 불고기소(30g)을 올린다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 모짜치즈(40g)을 토핑한다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "3. 생지를 위에 덥고 4분간 굽는다.",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 7,
            "name": "직화불닭파이",
            "steps": [
              {
                "name": "",
                "capacity": "",
                "etcName": "1. 생지를 예열된 판에 올리고 불닭소(30g)을 올린다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 모짜치즈(40g)을 토핑한다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "3. 생지를 위에 덥고 4분간 굽는다.",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 7,
            "name": "함박치즈파이",
            "steps": [
              {
                "name": "",
                "capacity": "",
                "etcName": "1. 생지를 예열된 판에 올리고 함박소(30g)을 올린다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 모짜치즈(40g)을 토핑한다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "3. 생지를 위에 덥고 4분간 굽는다.",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": 7,
            "name": "로제미트파이",
            "steps": [
              {
                "name": "",
                "capacity": "",
                "etcName": "1. 생지를 예열된 판에 올리고 로제미트소(30g)을 올린다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 모짜치즈(40g)을 토핑한다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "3. 생지를 위에 덥고 4분간 굽는다.",
                "etcCapacity": ""
              }
            ],
            "note": ""
          }
        ]
      },
      {
        "name": "에그120 카테고리 (디저트)",
        "recipes": [
          {
            "no": "A",
            "name": "에그120 굽는 방법",
            "steps": [
              {
                "name": "기계 온도 170도 셋팅",
                "capacity": "",
                "etcName": "1. 전원을 켠 후, 예열을 시켜준다.(빨간점등 확인, 약 10분 소요!)",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 한쪽 몰드에 반죽 60% 채우고 덮어서 2분~2분30초",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "3. 반대쪽 몰드에 120로고까지 반죽 넣고, 계란을 넣는다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "4. 양쪽 몰드에 소금을 살짝 뿌린다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "5. 처음에 익혀둔 몰드 반죽 테두리에 반죽 채우고 덮어서 3분",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "6. 타이머 울리면 반숙 계란빵 완성되고 2분이상 대기하면 완숙계란빵 완성",
                "etcCapacity": ""
              }
            ],
            "note": ""
          },
          {
            "no": "B",
            "name": "에그120 굽는 방법",
            "steps": [
              {
                "name": "기계 온도 170도 셋팅",
                "capacity": "",
                "etcName": "1. 전원을 켠 후, 예열을 시켜준다.(빨간점등 확인, 약 10분 소요!)",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "2. 한쪽 몰드에 반죽 60% 채운다",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "3. 반대쪽 몰드에 120로고까지 반죽 넣고, 계란을 넣는다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "4. 양쪽 몰드에 소금을 살짝 뿌리고 그 상태로 3분을 굽는다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "5. 3분후 반죽만 넣은 몰드 반죽 테두리에 반죽을 둘러서 채운다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "6. 뚜껑을 덮어서 3분을 더 구워준다.",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "",
                "etcName": "7. 타이머 울리면 반숙 계란빵 완성되고 2분이상 대기하면 완숙계란빵 완성",
                "etcCapacity": ""
              },
              {
                "name": "",
                "capacity": "120g",
                "etcName": "",
                "etcCapacity": ""
              }
            ],
            "note": ""
          }
        ]
      }
    ]
  }
];
