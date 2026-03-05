/**
 * 은행 목록 상수 (토스페이 은행 코드 기준)
 * https://docs-pay.toss.im/guide/bank-code
 *
 * 사용처:
 * - 회원가입 페이지
 * - 근로자 마이페이지
 * - 고용주 페이지
 */

import { ImageSourcePropType } from "react-native";

export interface BankInfo {
	name: string;
	logo: ImageSourcePropType;
	logoSize?: { width: number; height: number }; // 커스텀 로고 크기 (기본: 32x32)
}

/**
 * 은행 로고 이미지
 */
const BANK_LOGOS = {
	// 일반 은행
	kdb: require("../assets/images/banks/kdb.png"),
	ibk: require("../assets/images/banks/ibk.png"),
	kb: require("../assets/images/banks/kb.png"),
	keb: require("../assets/images/banks/keb.png"),
	suhyup: require("../assets/images/banks/suhyup.png"),
	nh: require("../assets/images/banks/nh.png"),
	woori: require("../assets/images/banks/woori.png"),
	sc: require("../assets/images/banks/sc.png"),
	citi: require("../assets/images/banks/citi.png"),
	im: require("../assets/images/banks/im.png"),
	kn_bs: require("../assets/images/banks/kn_bs.png"),
	gj_jb: require("../assets/images/banks/gj_jb.png"),
	shinhan_jeju: require("../assets/images/banks/shinhan_jeju.png"),
	mg: require("../assets/images/banks/mg.png"),
	sinhyup: require("../assets/images/banks/sinhyup.png"),
	sb: require("../assets/images/banks/sb.png"),
	sj: require("../assets/images/banks/sj.png"),
	epost: require("../assets/images/banks/epost.png"),
	kbank: require("../assets/images/banks/kbank.png"),
	kakao: require("../assets/images/banks/kakao.png"),
	toss: require("../assets/images/banks/toss.png"),
	sbi: require("../assets/images/banks/sbi.png"),
	// 증권사
	miraeAsset: require("../assets/images/banks/miraeAsset.png"),
	samsung: require("../assets/images/banks/samsung.png"),
	koreaInvestment: require("../assets/images/banks/koreaInvestment.png"),
	kyobo: require("../assets/images/banks/kyobo.png"),
	hyundai: require("../assets/images/banks/hyundai.png"),
	kiwoom: require("../assets/images/banks/kiwoom.png"),
	ls: require("../assets/images/banks/ls.png"),
	sk: require("../assets/images/banks/sk.png"),
	daishin: require("../assets/images/banks/daishin.png"),
	hanhwa: require("../assets/images/banks/hanhwa.png"),
	db: require("../assets/images/banks/db.png"),
	eugene: require("../assets/images/banks/eugene.png"),
	meritz: require("../assets/images/banks/meritz.png"),
} as const;

/**
 * 은행 정보 매핑 (로고, 표시 이름)
 */
export const BANK_INFO: Record<string, BankInfo> = {
	// 일반 은행
	KDB산업은행: { name: "KDB산업은행", logo: BANK_LOGOS.kdb },
	IBK기업은행: { name: "IBK기업은행", logo: BANK_LOGOS.ibk },
	KB국민은행: { name: "KB국민은행", logo: BANK_LOGOS.kb },
	KEB하나은행: { name: "KEB하나은행", logo: BANK_LOGOS.keb },
	수협은행: { name: "수협은행", logo: BANK_LOGOS.suhyup },
	NH농협은행: { name: "NH농협은행", logo: BANK_LOGOS.nh },
	우리은행: { name: "우리은행", logo: BANK_LOGOS.woori },
	SC은행: { name: "SC은행", logo: BANK_LOGOS.sc },
	씨티은행: { name: "씨티은행", logo: BANK_LOGOS.citi },
	대구은행: { name: "대구은행", logo: BANK_LOGOS.im },
	부산은행: { name: "부산은행", logo: BANK_LOGOS.kn_bs },
	광주은행: { name: "광주은행", logo: BANK_LOGOS.gj_jb },
	제주은행: { name: "제주은행", logo: BANK_LOGOS.shinhan_jeju },
	전북은행: { name: "전북은행", logo: BANK_LOGOS.gj_jb },
	경남은행: { name: "경남은행", logo: BANK_LOGOS.kn_bs },
	MG새마을금고: { name: "MG새마을금고", logo: BANK_LOGOS.mg },
	신협: { name: "신협", logo: BANK_LOGOS.sinhyup },
	저축은행: { name: "저축은행", logo: BANK_LOGOS.sb },
	산림조합: { name: "산림조합", logo: BANK_LOGOS.sj },
	우체국: { name: "우체국", logo: BANK_LOGOS.epost },
	하나은행: { name: "하나은행", logo: BANK_LOGOS.keb },
	신한은행: { name: "신한은행", logo: BANK_LOGOS.shinhan_jeju },
	케이뱅크: { name: "케이뱅크", logo: BANK_LOGOS.kbank },
	카카오뱅크: { name: "카카오뱅크", logo: BANK_LOGOS.kakao },
	토스뱅크: { name: "토스뱅크", logo: BANK_LOGOS.toss },
	SBI저축은행: { name: "SBI저축은행", logo: BANK_LOGOS.sbi },
	// 증권사
	KB증권: { name: "KB증권", logo: BANK_LOGOS.kb },
	미래에셋증권: { name: "미래에셋증권", logo: BANK_LOGOS.miraeAsset },
	삼성증권: { name: "삼성증권", logo: BANK_LOGOS.samsung },
	한국투자증권: { name: "한국투자증권", logo: BANK_LOGOS.koreaInvestment, logoSize: { width: 70, height: 32 } },
	NH투자증권: { name: "NH투자증권", logo: BANK_LOGOS.nh },
	교보증권: { name: "교보증권", logo: BANK_LOGOS.kyobo },
	하이투자증권: { name: "하이투자증권", logo: BANK_LOGOS.im },
	현대차투자증권: { name: "현대차투자증권", logo: BANK_LOGOS.hyundai },
	키움증권: { name: "키움증권", logo: BANK_LOGOS.kiwoom },
	이베스트증권: { name: "이베스트증권", logo: BANK_LOGOS.ls },
	SK증권: { name: "SK증권", logo: BANK_LOGOS.sk },
	대신증권: { name: "대신증권", logo: BANK_LOGOS.daishin },
	한화투자증권: { name: "한화투자증권", logo: BANK_LOGOS.hanhwa },
	하나증권: { name: "하나증권", logo: BANK_LOGOS.keb },
	토스증권: { name: "토스증권", logo: BANK_LOGOS.toss },
	신한투자증권: { name: "신한투자증권", logo: BANK_LOGOS.shinhan_jeju },
	DB금융투자: { name: "DB금융투자", logo: BANK_LOGOS.db },
	유진투자증권: { name: "유진투자증권", logo: BANK_LOGOS.eugene },
	메리츠증권: { name: "메리츠증권", logo: BANK_LOGOS.meritz },
};

export type BankName = keyof typeof BANK_INFO;

export const BANK_NAMES = Object.keys(BANK_INFO) as BankName[];


/**
 * 은행명 → 토스 은행 코드 매핑
 * https://docs-pay.toss.im/guide/bank-code
 */
export const BANK_NAME_TO_CODE: Record<string, string> = {
  KDB산업은행: "002",
  IBK기업은행: "003",
  KB국민은행: "004",
  수협은행: "007",
  NH농협은행: "011",
  우리은행: "020",
  SC은행: "023",
  씨티은행: "027",
  대구은행: "031",
  부산은행: "032",
  광주은행: "034",
  제주은행: "035",
  전북은행: "037",
  경남은행: "039",
  MG새마을금고: "045",
  신협: "048",
  저축은행: "050",
  산림조합: "064",
  우체국: "071",
  KEB하나은행: "081",
  하나은행: "081",
  신한은행: "088",
  케이뱅크: "089",
  카카오뱅크: "090",
  토스뱅크: "092",
  SBI저축은행: "050",
  // 증권사
  KB증권: "218",
  미래에셋증권: "238",
  삼성증권: "240",
  한국투자증권: "243",
  NH투자증권: "247",
  교보증권: "261",
  하이투자증권: "262",
  현대차투자증권: "263",
  키움증권: "264",
  이베스트증권: "265",
  SK증권: "266",
  대신증권: "267",
  한화투자증권: "269",
  하나증권: "270",
  토스증권: "271",
  신한투자증권: "278",
  DB금융투자: "279",
  유진투자증권: "280",
  메리츠증권: "287",
};
