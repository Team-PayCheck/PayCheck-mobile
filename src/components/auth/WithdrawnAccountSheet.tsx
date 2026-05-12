/**
 * 카카오 로그인 시 탈퇴 보류(WITHDRAWN_PENDING) 상태인 기존 계정이
 * 감지됐을 때 표시되는 안내 바텀시트.
 * 사용자에게 "기존 계정 복구" / "새 계정으로 가입" 두 가지 선택지를 제공한다.
 */
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import BottomSheetModal from "../common/BottomSheetModal";
import PrimaryButton from "../common/PrimaryButton";
import { Text } from "../common/Text";
import { colors } from "../../constants/colors";
import type { WithdrawnAccountInfo } from "../../api/auth/types";

interface WithdrawnAccountSheetProps {
	visible: boolean;
	onClose: () => void;
	withdrawnAccount: WithdrawnAccountInfo;
	onRestore: () => void;
	onPurgeAndRegister: () => void;
}

const USER_TYPE_LABEL: Record<WithdrawnAccountInfo["userType"], string> = {
	EMPLOYER: "사장님",
	WORKER: "근로자",
};

const formatWithdrawnAt = (iso: string): string => {
	const datePart = iso.split("T")[0];
	if (!datePart) return iso;
	const [y, m, d] = datePart.split("-");
	if (!y || !m || !d) return iso;
	return `${y}.${m}.${d}`;
};

const WithdrawnAccountSheet: React.FC<WithdrawnAccountSheetProps> = ({
	visible,
	onClose,
	withdrawnAccount,
	onRestore,
	onPurgeAndRegister,
}) => {
	const { name, userType, withdrawnAt, profileImageUrl } = withdrawnAccount;

	return (
		<BottomSheetModal visible={visible} onClose={onClose} maxHeight="80%">
			<View style={styles.container}>
				<View style={styles.profileSection}>
					{profileImageUrl ? (
						<Image
							source={{ uri: profileImageUrl }}
							style={styles.profileImage}
						/>
					) : (
						<View style={[styles.profileImage, styles.profilePlaceholder]} />
					)}
					<View style={styles.profileTextGroup}>
						<Text weight="Bold" style={styles.profileName}>
							{name}
						</Text>
						<Text weight="Medium" style={styles.profileType}>
							{USER_TYPE_LABEL[userType]}
						</Text>
					</View>
				</View>

				<View style={styles.infoBox}>
					<View style={styles.infoRow}>
						<Text weight="Medium" style={styles.infoLabel}>
							탈퇴 일자
						</Text>
						<Text weight="SemiBold" style={styles.infoValue}>
							{formatWithdrawnAt(withdrawnAt)}
						</Text>
					</View>
				</View>

				<View style={styles.descriptionSection}>
					<Text weight="Bold" style={styles.title}>
						탈퇴 처리된 계정이에요
					</Text>
					<Text weight="Medium" style={styles.description}>
						이 계정은 탈퇴 처리되어 30일 이내{"\n"}
						영구 삭제될 예정이에요.{"\n"}
						복구하거나 새 계정으로 가입할 수 있어요.
					</Text>
				</View>

				<View style={styles.actions}>
					<PrimaryButton text="기존 계정 복구" onPress={onRestore} />
					<TouchableOpacity
						style={styles.secondaryButton}
						onPress={onPurgeAndRegister}
						activeOpacity={0.7}
					>
						<Text weight="SemiBold" style={styles.secondaryButtonText}>
							새 계정으로 가입
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</BottomSheetModal>
	);
};

const styles = StyleSheet.create({
	container: {
		gap: 24,
		paddingTop: 4,
	},
	profileSection: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
	},
	profileImage: {
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: colors.backgroundGrey,
	},
	profilePlaceholder: {
		backgroundColor: colors.backgroundGrey,
	},
	profileTextGroup: {
		flex: 1,
		gap: 4,
	},
	profileName: {
		fontSize: 18,
		color: colors.textPrimary,
	},
	profileType: {
		fontSize: 13,
		color: colors.textSecondary,
	},
	infoBox: {
		backgroundColor: colors.backgroundGrey,
		borderRadius: 12,
		paddingVertical: 14,
		paddingHorizontal: 16,
	},
	infoRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	infoLabel: {
		fontSize: 13,
		color: colors.textSecondary,
	},
	infoValue: {
		fontSize: 14,
		color: colors.textPrimary,
	},
	descriptionSection: {
		gap: 10,
	},
	title: {
		fontSize: 18,
		color: colors.textPrimary,
	},
	description: {
		fontSize: 14,
		color: colors.textSecondary,
		lineHeight: 22,
	},
	actions: {
		gap: 8,
		paddingTop: 4,
	},
	secondaryButton: {
		paddingVertical: 14,
		alignItems: "center",
		justifyContent: "center",
	},
	secondaryButtonText: {
		fontSize: 14,
		color: colors.textSecondary,
	},
});

export default WithdrawnAccountSheet;
