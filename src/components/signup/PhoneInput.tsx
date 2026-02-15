import React, { useRef } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Text } from "../common/Text";
import { colors } from "../../constants/colors";

interface PhoneInputProps {
	value: string; // "010-1234-5678" 형식
	onChangeText: (text: string) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChangeText }) => {
	const input2Ref = useRef<TextInput>(null);
	const input3Ref = useRef<TextInput>(null);

	// "010-1234-5678" -> ["010", "1234", "5678"]
	const parts = value.split("-");
	const part1 = parts[0] || "";
	const part2 = parts[1] || "";
	const part3 = parts[2] || "";

	const handlePart1Change = (text: string) => {
		const cleaned = text.replace(/[^0-9]/g, "").slice(0, 3);
		onChangeText(`${cleaned}-${part2}-${part3}`);
		if (cleaned.length === 3) {
			input2Ref.current?.focus();
		}
	};

	const handlePart2Change = (text: string) => {
		const cleaned = text.replace(/[^0-9]/g, "").slice(0, 4);
		onChangeText(`${part1}-${cleaned}-${part3}`);
		if (cleaned.length === 4) {
			input3Ref.current?.focus();
		}
	};

	const handlePart3Change = (text: string) => {
		const cleaned = text.replace(/[^0-9]/g, "").slice(0, 4);
		onChangeText(`${part1}-${part2}-${cleaned}`);
	};

	return (
		<View style={styles.container}>
			<Text weight="Medium" style={styles.label}>
				핸드폰 번호
			</Text>
			<View style={styles.inputRow}>
				<TextInput
					style={styles.input}
					value={part1}
					onChangeText={handlePart1Change}
					keyboardType="number-pad"
					maxLength={3}
					placeholder="010"
					placeholderTextColor={colors.textDisabled}
				/>
				<TextInput
					ref={input2Ref}
					style={styles.input}
					value={part2}
					onChangeText={handlePart2Change}
					keyboardType="number-pad"
					maxLength={4}
					placeholder="0000"
					placeholderTextColor={colors.textDisabled}
				/>
				<TextInput
					ref={input3Ref}
					style={styles.input}
					value={part3}
					onChangeText={handlePart3Change}
					keyboardType="number-pad"
					maxLength={4}
					placeholder="0000"
					placeholderTextColor={colors.textDisabled}
				/>
			</View>
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
	inputRow: {
		flexDirection: "row",
		gap: 8,
	},
	input: {
		flex: 1,
		height: 48,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: 12,
		backgroundColor: colors.white,
		fontSize: 16,
		color: colors.textPrimary,
		textAlign: "center",
	},
});

export default PhoneInput;
