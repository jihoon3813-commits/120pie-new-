export interface ContractSuppliesItem {
  id: number;
  supplyType: "직접제조" | "재판매";
  name: string;
  unit: string;
  price: number;
  calculationBasis: string;
}

export const OFFICIAL_SUPPLIES_LIST: ContractSuppliesItem[] = [
  { id: 1, supplyType: "직접제조", name: "120파이메이커", unit: "1ea", price: 880000, calculationBasis: "당사 간접제조원가, 판관비 포함하여 마진율 30%" },
  { id: 2, supplyType: "직접제조", name: "에그120메이커", unit: "1ea", price: 980000, calculationBasis: "당사 간접제조원가, 판관비 포함하여 마진율 30%" },
  { id: 3, supplyType: "직접제조", name: "생지", unit: "400ea", price: 200000, calculationBasis: "당사 직접제조원가, 판관비 포함하여 마진율 30%" },
  { id: 4, supplyType: "직접제조", name: "에그120반죽", unit: "20kg", price: 100000, calculationBasis: "당사 직접제조원가, 판관비 포함하여 마진율 30%" },
  { id: 5, supplyType: "직접제조", name: "에그120유황란", unit: "120ea", price: 69600, calculationBasis: "당사 간접제조원가, 판관비 포함하여 마진율 30%" },
  { id: 6, supplyType: "직접제조", name: "직화불고기파이소", unit: "1kg", price: 19800, calculationBasis: "당사 간접제조원가, 판관비 포함하여 마진율 30%" },
  { id: 7, supplyType: "직접제조", name: "직화불닭파이소", unit: "1kg", price: 21200, calculationBasis: "당사 간접제조원가, 판관비 포함하여 마진율 30%" },
  { id: 8, supplyType: "직접제조", name: "함박치즈파이소", unit: "1kg", price: 18900, calculationBasis: "당사 간접제조원가, 판관비 포함하여 마진율 30%" },
  { id: 9, supplyType: "직접제조", name: "로제미트파이소", unit: "1kg", price: 21800, calculationBasis: "당사 간접제조원가, 판관비 포함하여 마진율 30%" },
  { id: 10, supplyType: "직접제조", name: "크림치즈파이", unit: "1kg", price: 11900, calculationBasis: "당사 간접제조원가, 판관비 포함하여 마진율 30%" },
  { id: 11, supplyType: "재판매", name: "애플파이소", unit: "1kg", price: 6855, calculationBasis: "당사 매입비용, 판관비 포함하여 마진율 25%" },
  { id: 12, supplyType: "재판매", name: "블루베리파이소", unit: "1kg", price: 11850, calculationBasis: "당사 매입비용, 판관비 포함하여 마진율 25%" },
  { id: 13, supplyType: "재판매", name: "망고파이소", unit: "1kg", price: 9780, calculationBasis: "당사 매입비용, 판관비 포함하여 마진율 25%" },
  { id: 14, supplyType: "재판매", name: "앙고구마파이소", unit: "1kg", price: 19446, calculationBasis: "당사 매입비용, 판관비 포함하여 마진율 25%" },
  { id: 15, supplyType: "재판매", name: "모짜렐라치즈", unit: "2.5kg", price: 28600, calculationBasis: "당사 매입비용, 판관비 포함하여 마진율 28%" },
  { id: 16, supplyType: "재판매", name: "커스터드파이소", unit: "1kg", price: 7955, calculationBasis: "당사 매입비용, 판관비 포함하여 마진율 25%" },
];

export const HEADQUARTERS_INFO = {
  companyName: "(주)고우웰라이프",
  ceoName: "이사근",
  bizNumber: "787-88-00444",
  address: "서울시 강남구 테헤란로82길 15, 141호",
  phone: "1566-3594",
  depositBank: "하나은행",
  depositAccount: "288-910020-63905",
  depositAccountHolder: "㈜고우웰라이프",
  royaltyBank: "케이뱅크",
  royaltyAccount: "700-120-270001",
  royaltyAccountHolder: "㈜고우웰라이프",
  trademarkNumber: "등록 제40-1839790",
  trademarkDecisionDate: "2022년 1월 3일",
  trademarkExpireDate: "2032년 3월 2일",
  trademarkClass: "제43류",
};
