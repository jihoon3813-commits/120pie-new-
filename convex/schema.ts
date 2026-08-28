import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  popups: defineTable({
    isActive: v.boolean(),
    title: v.string(),
    desc: v.string(),
    image: v.optional(v.string()),
    link: v.optional(v.string()),
    btnText: v.optional(v.string()),
    titleColor: v.optional(v.string()),
    titleSize: v.optional(v.string()),
    descColor: v.optional(v.string()),
    descSize: v.optional(v.string()),
    btnBgColor: v.optional(v.string()),
    btnTextColor: v.optional(v.string()),
    btnTextSize: v.optional(v.string()),
    startDate: v.optional(v.string()),  // 게시 시작일 YYYY-MM-DD
    endDate: v.optional(v.string()),    // 게시 종료일 YYYY-MM-DD
    targetPage: v.optional(v.string()),              // 게시 대상 페이지: "landing" | "portal" | "all"
    createdAt: v.optional(v.string()),  // 생성 일자
  }),
  floatings: defineTable({
    isActive: v.boolean(),
    instaUrl: v.optional(v.string()),
    youtubeUrl: v.optional(v.string()),
    chatUrl: v.optional(v.string()),
    phoneNo: v.optional(v.string()),
    kakaoUrl: v.optional(v.string()),
    blogUrl: v.optional(v.string()),
  }),
  inquiries: defineTable({
    name: v.string(),
    phone: v.string(),
    storeType: v.string(),
    existingStoreName: v.optional(v.string()),
    message: v.optional(v.string()),
    regDate: v.string(),
  }),
  gallery: defineTable({
    name: v.string(),
    category: v.string(),
    url: v.string(),
    regDate: v.string(),
    orderIndex: v.optional(v.number()),
    isFeatured: v.optional(v.boolean()),
  }),
  galleryCategories: defineTable({
    categories: v.array(v.string()),
  }),
  stores: defineTable({
    id: v.string(), // 로그인 ID (e.g. store1)
    pw: v.string(), // 비밀번호
    pwConfirm: v.string(), // 비밀번호 확인
    name: v.string(), // 가맹점명
    owner: v.string(), // 점주명
    phone: v.string(), // 연락처
    status: v.string(), // 가맹상태 ("승인" | "대기" | "보류" | "중지" | "취소")
    roadAddress: v.string(), // 도로명주소
    detailAddress: v.string(), // 상세주소
    lat: v.optional(v.number()), // 위도 (Latitude)
    lng: v.optional(v.number()), // 경도 (Longitude)
    regDate: v.string(), // 가맹 등록일 (YYYY-MM-DD)
    cancelDate: v.optional(v.string()), // 가맹 해지일
    adoptionMenu: v.array(v.string()), // 도입 메뉴 브랜드 배열
    monthlySales: v.number(), // 월매출
    partnerId: v.optional(v.string()), // 유치 영업 파트너 ID (e.g. partner1)
  }),
  products: defineTable({
    id: v.string(), // e.g. "prod-1"
    orderIndex: v.number(),
    name: v.string(),
    category: v.string(),
    modelName: v.string(),
    unit: v.string(), // "개" | "박스" | "kg" | "SET" | "EA" | "대"
    qty: v.number(),
    supplyPrice: v.number(),
    price: v.number(),
    discountAmount: v.number(),
    discountedPrice: v.number(),
    img: v.string(),
    detailImg: v.optional(v.string()),
    detailText: v.optional(v.string()),
    isActive: v.boolean(),
    desc: v.string(),
    stock: v.string(), // "in_stock" | "low_stock" | "out_of_stock"
    status: v.optional(v.string()), // "판매중" | "품절" | "단종"
    labels: v.optional(v.array(v.string())),
    shippingType: v.optional(v.string()), // "free" | "A" | "B" | "C"
    options: v.optional(v.array(v.string())),
  }).index("by_prod_id", ["id"])
    .index("by_orderIndex", ["orderIndex"]),
  orders: defineTable({
    id: v.string(), // e.g. "ORD-20260525-01"
    date: v.string(), // YYYY-MM-DD
    items: v.array(
      v.object({
        productName: v.string(),
        quantity: v.number(),
        price: v.number(),
        selectedOption: v.optional(v.string()),
      })
    ),
    totalPrice: v.number(),
    status: v.string(), // "대기" | "배송중" | "배송완료" 등
    storeId: v.optional(v.string()), // 발주 넣은 가맹점의 ID
    courier: v.optional(v.string()),    // 택배사명 (e.g. "CJ대한통운", "한진택배" 등)
    trackingNo: v.optional(v.string()), // 송장번호
    trackingList: v.optional(
      v.array(
        v.object({
          courier: v.string(),
          trackingNo: v.string(),
        })
      )
    ), // 다중 송장번호 리스트
    impUid: v.optional(v.string()), // 포트원 고유 결제번호
    payMethod: v.optional(v.string()), // 결제수단 (e.g. "card")
    deliveryAddress: v.optional(v.string()),       // 배송지 주소 (도로명)
    deliveryDetailAddress: v.optional(v.string()),  // 배송지 상세주소
    recipientName: v.optional(v.string()),          // 받는 사람
    recipientPhone: v.optional(v.string()),         // 받는 사람 연락처
  }).index("by_order_id", ["id"]),
  materials: defineTable({
    title: v.string(),
    date: v.string(), // YYYY-MM-DD
    size: v.string(), // e.g. "12.4 MB"
    format: v.string(), // e.g. "PDF" | "ZIP" | "PNG"
    desc: v.string(),
    img: v.optional(v.string()), // 썸네일 이미지 (Base64)
    fileUrl: v.optional(v.string()), // 실제 파일 바이너리 (Base64 Data URL)
    storageId: v.optional(v.string()), // Convex Storage ID
    fileName: v.optional(v.string()), // 업로드된 실제 파일명
    type: v.string(), // "training" (교육자료) | "pr" (홍보자료)
  }),
  storeInquiries: defineTable({
    id: v.string(), // e.g. "INQ-234"
    storeId: v.string(), // 가맹점 로그인 ID
    storeName: v.string(), // 가맹점명
    category: v.string(), // "물류" | "정산" | "마케팅" | "조리/AS" | "기타"
    title: v.string(),
    content: v.string(),
    date: v.string(), // YYYY-MM-DD
    status: v.string(), // "답변대기" | "답변완료"
    answer: v.optional(v.string()), // 본사 답변 내용
    answerDate: v.optional(v.string()), // 답변 작성일자 (YYYY-MM-DD)
  }),
  notices: defineTable({
    id: v.string(), // e.g. "NOT-01"
    tag: v.string(), // "필독" | "일반" | "신메뉴" | "물류" | "이벤트"
    title: v.string(),
    content: v.string(),
    date: v.string(), // YYYY-MM-DD
    views: v.number(),
  }),
  productCategories: defineTable({
    categories: v.array(v.string()),
  }),
  analytics: defineTable({
    type: v.string(), // "visit" | "menu_view"
    path: v.string(), // 웹 경로, e.g. "/landing-v4", "/portal"
    menuName: v.optional(v.string()), // 브랜드 메뉴 명칭 (e.g. "120겹파이", "에그120", "츄러스120")
    referrer: v.optional(v.string()), // 유입경로
    ip: v.string(), // 접속 IP 주소
    date: v.string(), // YYYY-MM-DD
  }).index("by_date", ["date"]),
  banners: defineTable({
    mainTag: v.string(),
    mainTitle: v.string(),
    mainDesc: v.string(),
    mainBtnText: v.optional(v.string()),
    mainLink: v.optional(v.string()),
    sideTag: v.string(),
    sideTitle: v.string(),
    sideDesc: v.string(),
    sideBtnText: v.string(),
    mainImage: v.optional(v.string()),
    sideImage: v.optional(v.string()),
    sideLink: v.optional(v.string()),
  }),
  contracts: defineTable({
    ownerName: v.string(), // 가맹사업자명
    ownerBirth: v.string(), // 가맹사업자 생년월일
    ownerPhone: v.string(), // 가맹사업자 연락처
    storeAddress: v.string(), // 가맹점 주소
    storeName: v.string(), // 가맹점 명칭
    storeSize: v.number(), // 가맹점 규모 (㎡)
    businessArea: v.string(), // 영업 지역
    contractStart: v.string(), // 계약 기간 시작일 (YYYY-MM-DD)
    contractEnd: v.string(), // 계약 기간 종료일 (YYYY-MM-DD)
    
    // 금액 관련
    supervisionFee: v.number(), // 공사감리비
    initialFranchiseFee: v.number(), // 최초가맹금
    
    // 예치가맹금
    depositMembershipFee: v.number(), // 가입비
    depositEduFee: v.number(), // 오픈교육비
    depositSupportFee: v.number(), // 오픈지원비
    depositGuaranteeFee: v.number(), // 계약이행보증금
    depositTotalFee: v.number(), // 합계
    
    royaltyFee: v.number(), // 로열티
    guaranteeFee: v.number(), // 계약이행보증금 (부가세 없음)
    
    // 교육비
    eduOpenFee: v.number(), // 오픈교육 (최초가맹금에 포함)
    eduNewFee: v.number(), // 신입교육 (1인 기준)
    
    initialSupplyFee: v.number(), // 초도물품
    reFranchiseFee: v.number(), // 재가맹비
    penaltyFee: v.number(), // 위약금
    
    status: v.string(), // 상태 ("기본정보 등록" | "계약서 발송완료" | "계약서 서명완료" | "계약서 진행취소")
    createdAt: v.string(), // 등록일시 (YYYY-MM-DD HH:mm:ss)
    fileUrl: v.optional(v.string()), // 최종 계약 서명한 파일 URL (Base64 Data URL)
    fileName: v.optional(v.string()), // 업로드된 실제 파일명
    contractType: v.optional(v.string()), // 계약 구분 ("신규" | "갱신" | "양수")
    signatureImage: v.optional(v.string()), // 전자서명 이미지 (Base64 PNG)
    signedAt: v.optional(v.string()), // 전자서명 완료 일시 (YYYY-MM-DD HH:mm:ss)
    sentAt: v.optional(v.string()), // 전자계약서 문자 발송 일시 (YYYY-MM-DD HH:mm:ss)
    signerIp: v.optional(v.string()), // 서명자 IP / 기기 정보
    agreeTerms: v.optional(v.boolean()), // 약관 및 특약 동의 여부
    agreePrivacy: v.optional(v.boolean()), // 정보공개서 숙고기간 확인 여부
    agreeSupplies: v.optional(v.boolean()), // 구입강제품목 공급가격 확인 여부
  }),
  deliveryCredentials: defineTable({
    noticeId: v.string(), // 공지사항 ID ("NOT-XXX")
    storeId: v.string(), // 가맹점 로그인 ID
    storeName: v.string(), // 가맹점명
    baeminId: v.string(),
    baeminPw: v.string(),
    coupangId: v.string(),
    coupangPw: v.string(),
    submittedAt: v.string(), // YYYY-MM-DD HH:mm:ss
  }).index("by_noticeId", ["noticeId"])
    .index("by_storeId_and_noticeId", ["storeId", "noticeId"]),
  instagram: defineTable({
    img: v.string(),
    text: v.string(),
    link: v.string(),
    date: v.string(),
    orderIndex: v.number(),
    isMain: v.optional(v.boolean()),
  }),
  partners: defineTable({
    id: v.string(), // 로그인 ID (e.g. partner1)
    pw: v.string(), // 비밀번호
    name: v.string(), // 파트너 이름 / 대표자명
    phone: v.string(), // 연락처
    email: v.optional(v.string()), // 이메일
    companyName: v.optional(v.string()), // 상호명 / 소속
    bankName: v.optional(v.string()), // 정산 은행명
    accountNumber: v.optional(v.string()), // 계좌번호
    accountHolder: v.optional(v.string()), // 예금주명
    commissionPerBox: v.optional(v.number()), // 생지 박스당 수수료 (기본 8000원 VAT포함)
    status: v.string(), // "활동중" | "대기" | "정지"
    regDate: v.string(), // 등록일자 (YYYY-MM-DD)
    memo: v.optional(v.string()), // 본사 메모
  }).index("by_partner_id", ["id"]),
  partnerSettlements: defineTable({
    partnerId: v.string(), // 파트너 ID
    yearMonth: v.string(), // 정산 년월 (YYYY-MM)
    boxCount: v.number(), // 총 생지 주문 박스 수
    commissionAmount: v.number(), // 총 수수료 (박스수 * 8000원)
    status: v.string(), // "정산대기" | "정산확정" | "지급완료"
    paidDate: v.optional(v.string()), // 실제 지급일자 (YYYY-MM-DD)
    note: v.optional(v.string()), // 정산 메모
  }).index("by_partner_yearMonth", ["partnerId", "yearMonth"])
    .index("by_yearMonth", ["yearMonth"]),
  commercialTargets: defineTable({
    name: v.string(), // 매장명 (e.g. "스타덤PC방 강남역점")
    category: v.string(), // 업종 (PC방, 만화카페, 스터디카페, 키즈카페, 보드게임카페, 멀티방, 카페/베이커리, 피트니스 등)
    sido: v.string(), // 특별시/광역시/도 (e.g. "서울특별시", "경기도", "부산광역시")
    sigungu: v.string(), // 시/군/구 (e.g. "강남구", "해운대구", "분당구")
    dong: v.string(), // 읍/면/동 (e.g. "역삼동", "우동", "서현동")
    roadAddress: v.string(), // 도로명 주소
    detailAddress: v.optional(v.string()), // 상세주소 (층/호수)
    lat: v.number(), // 위도 (Latitude)
    lng: v.number(), // 경도 (Longitude)
    phone: v.optional(v.string()), // 매장 대표번호
    mobile: v.optional(v.string()), // 점주/대표자 휴대폰
    email: v.optional(v.string()), // 이메일
    instagram: v.optional(v.string()), // 인스타그램 계정/링크
    homepage: v.optional(v.string()), // 웹사이트/네이버플레이스 링크
    status: v.string(), // "영업가능" | "상담중" | "계약체결" | "보류"
    isContracted: v.boolean(), // 계약 체결 여부 (true 시 반경 500m 상권보호 발동)
    contractDate: v.optional(v.string()), // 계약 체결일자 (YYYY-MM-DD)
    assignedPartnerId: v.optional(v.string()), // 담당 영업 파트너 ID (e.g. partner1)
    assignedPartnerName: v.optional(v.string()), // 담당 영업 파트너 이름
    memo: v.optional(v.string()), // 영업/상담 메모
    regDate: v.string(), // 등록일자 (YYYY-MM-DD)
  }).index("by_sido", ["sido"])
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_isContracted", ["isContracted"])
    .index("by_name", ["name"]),
  smsSettings: defineTable({
    settings: v.any(),
    updatedAt: v.optional(v.string()),
  }),
});
