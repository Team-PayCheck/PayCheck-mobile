import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as Linking from "expo-linking";
import { Alert } from "react-native";

export interface ProcessedImage {
	uri: string; // 로컬 파일 경로 (미리보기용)
	base64: string; // API 전송용
}

/**
 * 권한 거부 시 설정 이동 Alert
 */
const showPermissionAlert = (): void => {
	Alert.alert(
		"사진 접근 권한 필요",
		"프로필 사진을 설정하려면 사진 접근 권한이 필요합니다.",
		[
			{ text: "나중에", style: "cancel" },
			{ text: "설정", onPress: () => Linking.openSettings() },
		]
	);
};

/**
 * 프로필 이미지 선택 (갤러리) + 압축 + base64 변환
 *
 * @returns ProcessedImage (uri + base64) 또는 null (취소/권한거부)
 *
 * 이미지 설정:
 * - 크기: 400x400 (정사각형)
 * - 압축: 0.7
 * - 포맷: JPEG
 * - 예상 파일 크기: 30~80KB
 */
export const pickProfileImage = async (): Promise<ProcessedImage | null> => {
	// 1. 권한 확인
	const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

	if (status !== "granted") {
		showPermissionAlert();
		return null;
	}

	// 2. 갤러리 열기
	const result = await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ["images"],
		allowsEditing: true,
		aspect: [1, 1], // 정사각형
		quality: 1,
	});

	if (result.canceled) {
		return null;
	}

	// 3. 압축 + base64 변환
	const processed = await manipulateAsync(
		result.assets[0].uri,
		[{ resize: { width: 400, height: 400 } }],
		{
			compress: 0.7,
			format: SaveFormat.JPEG,
			base64: true,
		}
	);

	return {
		uri: processed.uri,
		base64: processed.base64!,
	};
};
