/**
 * 앱 전역 색상 상수
 * 모든 컴포넌트에서 이 파일을 import해서 사용
 */

export const colors = {
	// 버튼/강조 색상
	primary: "#0158CC",
	primaryLight: "#E8F1FC",

	// 배경
	background: "#FDFDFD",
	backgroundGrey: "#F5F5F5",

	// 텍스트
	textPrimary: "#161616",
	textSecondary: "#777777",
	textMuted: "#AAAAAA",
	textDisabled: "#CCCCCC",
	

	// 테두리/구분선
	border: "#E8E8E8",
	borderLight: "#F0F0F0",

	// 상태 색상
	red: "#F17D77",
	yellow: "#FCE38A",
	mint: "#E0F2F1",
	green: "#28C28D",

	// 기타
 	blue: "#038BFA",
	grey: "#EEEEEE",
	white: "#FFFFFF",
	black: "#000000",
	disabled: "#EEEEEE",
	deleteRed: "#FF4D4F",
	lightBlue: "#a8cfff",
} as const;

export type ColorName = keyof typeof colors;
