import React from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	FlatList,
	Dimensions,
	Image,
} from "react-native";
import { Text } from "../common/Text";
import BottomSheetModal from "../common/BottomSheetModal";
import { colors } from "../../constants/colors";
import { BANK_INFO, BANK_NAMES, type BankName } from "../../constants/bank";

interface BankSelectModalProps {
	visible: boolean;
	onClose: () => void;
	onSelect: (bankName: BankName) => void;
	selectedBank?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH = (SCREEN_WIDTH - 48 - 24) / 3;

const BankSelectModal: React.FC<BankSelectModalProps> = ({
	visible,
	onClose,
	onSelect,
	selectedBank,
}) => {
	const renderBankItem = ({ item }: { item: BankName }) => {
		const bankInfo = BANK_INFO[item];
		const isSelected = selectedBank === item;

		return (
			<TouchableOpacity
				style={[styles.bankItem, isSelected && styles.bankItemSelected]}
				onPress={() => {
					onSelect(item);
					onClose();
				}}
				activeOpacity={0.7}
			>
				<View style={styles.logoContainer}>
					{bankInfo.logo ? (
						<Image
							source={bankInfo.logo}
							style={[
								styles.logo,
								bankInfo.logoSize && {
									width: bankInfo.logoSize.width,
									height: bankInfo.logoSize.height,
								},
							]}
							resizeMode="contain"
						/>
					) : (
						<View style={styles.logoPlaceholder}>
							<Text weight="Bold" style={styles.logoText}>
								{bankInfo.name.slice(0, 2)}
							</Text>
						</View>
					)}
				</View>
				<Text
					weight={isSelected ? "Bold" : "Medium"}
					style={[styles.bankName, isSelected && styles.bankNameSelected]}
					numberOfLines={1}
				>
					{bankInfo.name}
				</Text>
			</TouchableOpacity>
		);
	};

	return (
		<BottomSheetModal visible={visible} onClose={onClose} maxHeight="80%">
			<Text weight="Bold" style={styles.title}>
				은행을 선택해주세요
			</Text>
			<FlatList
				data={BANK_NAMES}
				renderItem={renderBankItem}
				keyExtractor={(item) => item}
				numColumns={3}
				contentContainerStyle={styles.listContent}
				columnWrapperStyle={styles.row}
				showsVerticalScrollIndicator={false}
			/>
		</BottomSheetModal>
	);
};

const styles = StyleSheet.create({
	title: {
		fontSize: 18,
		color: colors.textPrimary,
		marginBottom: 20,
	},
	listContent: {
		paddingBottom: 20,
	},
	row: {
		justifyContent: "flex-start",
		gap: 12,
		marginBottom: 12,
	},
	bankItem: {
		width: ITEM_WIDTH,
		height: 90,
		backgroundColor: colors.backgroundGrey,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		borderWidth: 2,
		borderColor: "transparent",
	},
	bankItemSelected: {
		borderColor: colors.primary,
		backgroundColor: colors.primaryLight,
	},
	logoContainer: {
		width: 36,
		height: 36,
		alignItems: "center",
		justifyContent: "center",
	},
	logo: {
		width: 32,
		height: 32,
	},
	logoPlaceholder: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: colors.primary,
		alignItems: "center",
		justifyContent: "center",
	},
	logoText: {
		fontSize: 12,
		color: colors.white,
	},
	bankName: {
		fontSize: 12,
		color: colors.textPrimary,
		textAlign: "center",
	},
	bankNameSelected: {
		color: colors.primary,
	},
});

export default BankSelectModal;
