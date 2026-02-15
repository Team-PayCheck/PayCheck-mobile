import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../common/Text";
import { colors } from "../../constants/colors";

interface FormInputProps {
	label: string;
	value: string;
	onChangeText?: (text: string) => void;
	placeholder?: string;
	keyboardType?: "default" | "number-pad" | "phone-pad";
	editable?: boolean;
	onPress?: () => void; // 선택형 입력 (은행 선택 등)
	showChevron?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
	label,
	value,
	onChangeText,
	placeholder,
	keyboardType = "default",
	editable = true,
	onPress,
	showChevron = false,
}) => {
	const isSelectable = !!onPress;

	const InputContent = (
		<View style={styles.inputContainer}>
			<TextInput
				style={styles.input}
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				placeholderTextColor={colors.textDisabled}
				keyboardType={keyboardType}
				editable={!isSelectable && editable}
				pointerEvents={isSelectable ? "none" : "auto"}
			/>
			{showChevron && (
				<Ionicons
					name="chevron-down"
					size={20}
					color={colors.textMuted}
					style={styles.chevron}
				/>
			)}
		</View>
	);

	return (
		<View style={styles.container}>
			<Text weight="Medium" style={styles.label}>
				{label}
			</Text>
			{isSelectable ? (
				<TouchableOpacity onPress={onPress} activeOpacity={0.7}>
					{InputContent}
				</TouchableOpacity>
			) : (
				InputContent
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
		gap: 8,
	},
	label: {
		fontSize: 14,
		color: colors.textSecondary,
		textAlign: "center",
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 12,
		backgroundColor: colors.white,
	},
	input: {
		flex: 1,
		height: 48,
		paddingHorizontal: 16,
		fontSize: 16,
		color: colors.textPrimary,
		textAlign: "center",
	},
	chevron: {
		paddingRight: 12,
	},
});

export default FormInput;
