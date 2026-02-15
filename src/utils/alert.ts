import { ALERT_TYPE, Toast } from "react-native-alert-notification";

/**
 * 성공 알림
 */
export const showSuccess = (title: string, message?: string) => {
	Toast.show({
		type: ALERT_TYPE.SUCCESS,
		title,
		textBody: message || "",
	});
};

/**
 * 에러 알림
 */
export const showError = (title: string, message?: string) => {
	Toast.show({
		type: ALERT_TYPE.DANGER,
		title,
		textBody: message || "",
	});
};

/**
 * 경고 알림
 */
export const showWarning = (title: string, message?: string) => {
	Toast.show({
		type: ALERT_TYPE.WARNING,
		title,
		textBody: message || "",
	});
};

/**
 * 정보 알림
 */
export const showInfo = (title: string, message?: string) => {
	Toast.show({
		type: ALERT_TYPE.INFO,
		title,
		textBody: message || "",
	});
};

/**
 * API 에러 코드에 따른 메시지 매핑
 */
export const getErrorMessage = (code?: string, defaultMessage?: string): string => {
	const errorMessages: Record<string, string> = {
		BAD_REQUEST: "잘못된 요청입니다.",
		UNAUTHORIZED: "인증에 실패했습니다.",
		NOT_FOUND: "요청한 정보를 찾을 수 없습니다.",
		CONFLICT: "이미 존재하는 데이터입니다.",
		INTERNAL_SERVER_ERROR: "서버 오류가 발생했습니다.",
	};

	return errorMessages[code || ""] || defaultMessage || "알 수 없는 오류가 발생했습니다.";
};
