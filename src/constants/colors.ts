/**
 * 앱 전역 색상 상수
 * 모든 컴포넌트에서 이 파일을 import해서 사용
 */

export const colors = {
	// 메인 색상
	main: "#769FCD",
	mainDark: "#5A7FA8",

	// 버튼/강조 색상
	primary: "#0158CC",
	primaryLight: "#E8F1FC",

	// 배경
	background: "#FDFDFD",
	backgroundGrey: "#F5F5F5",

	// 텍스트
	textPrimary: "#111111",
	textSecondary: "#777777",
	textMuted: "#AAAAAA",
	textDisabled: "#CCCCCC",

	// 테두리/구분선
	border: "#E8E8E8",
	borderLight: "#F0F0F0",

	// 상태 색상
	red: "#F38181",
	yellow: "#FCE38A",
	mint: "#95E1D3",
	green: "#27C840",

	// 기타
	grey: "#D9D9D9",
	white: "#FFFFFF",
	black: "#000000",
} as const;

export type ColorName = keyof typeof colors;
