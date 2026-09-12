export interface PartnerGradeInfo {
  grade: number;
  name: string;
  enName: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  description: string;
}

export const PARTNER_GRADES: Record<number, PartnerGradeInfo> = {
  1: {
    grade: 1,
    name: "스탠다드",
    enName: "Standard",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-700",
    badgeBorder: "border-slate-200",
    description: "기본 파트너 등급",
  },
  2: {
    grade: 2,
    name: "프로",
    enName: "Pro",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    badgeBorder: "border-blue-200",
    description: "우수 실적 프로 파트너",
  },
  3: {
    grade: 3,
    name: "엘리트",
    enName: "Elite",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    badgeBorder: "border-emerald-200",
    description: "최우수 실적 엘리트 파트너",
  },
  4: {
    grade: 4,
    name: "마스터",
    enName: "Master",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
    badgeBorder: "border-purple-200",
    description: "핵심 실적 마스터 파트너",
  },
  5: {
    grade: 5,
    name: "VIP",
    enName: "VIP",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-900",
    badgeBorder: "border-amber-300",
    description: "최고 실적 VIP 파트너",
  },
};

export const getPartnerGradeName = (grade: number | string | undefined | null): string => {
  const g = Number(grade) || 1;
  return PARTNER_GRADES[g]?.name || "스탠다드";
};

export const getPartnerGradeBadge = (grade: number | string | undefined | null): PartnerGradeInfo => {
  const g = Number(grade) || 1;
  return PARTNER_GRADES[g] || PARTNER_GRADES[1];
};
