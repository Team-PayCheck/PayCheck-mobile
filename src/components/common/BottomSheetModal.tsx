import React, { useRef, useEffect, useCallback } from "react";
import {
	View,
	Modal,
	StyleSheet,
	TouchableOpacity,
	Animated,
	Dimensions,
	KeyboardAvoidingView,
	Platform,
	type DimensionValue,
} from "react-native";
import { colors } from "../../constants/colors";

interface BottomSheetModalProps {
	visible: boolean;
	onClose: () => void;
	children: React.ReactNode;
	maxHeight?: DimensionValue;
}

const SCREEN_HEIGHT = Dimensions.get("window").height;

const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
	visible,
	onClose,
	children,
	maxHeight = "90%",
}) => {
	const slideAnim = useRef(new Animated.Value(0)).current;
	const overlayAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (visible) {
			Animated.parallel([
				Animated.timing(overlayAnim, {
					toValue: 1,
					duration: 250,
					useNativeDriver: true,
				}),
				Animated.spring(slideAnim, {
					toValue: 1,
					damping: 20,
					stiffness: 200,
					useNativeDriver: true,
				}),
			]).start();
		} else {
			slideAnim.setValue(0);
			overlayAnim.setValue(0);
		}
	}, [visible]);

	const handleClose = useCallback(() => {
		Animated.parallel([
			Animated.timing(overlayAnim, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}),
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}),
		]).start(() => {
			onClose();
		});
	}, [onClose]);

	const translateY = slideAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [SCREEN_HEIGHT, 0],
	});

	return (
		<Modal
			visible={visible}
			transparent
			animationType="none"
			onRequestClose={handleClose}
		>
			<KeyboardAvoidingView
				style={styles.keyboardAvoid}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<View style={styles.overlay}>
					<Animated.View
						style={[
							styles.overlayBackground,
							{ opacity: overlayAnim },
						]}
					>
						<TouchableOpacity
							style={StyleSheet.absoluteFill}
							activeOpacity={1}
							onPress={handleClose}
						/>
					</Animated.View>
					<Animated.View
						style={[
							styles.modalContainer,
							{ maxHeight },
							{ transform: [{ translateY }] },
						]}
					>
						<View style={styles.handle} />
						{children}
					</Animated.View>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	keyboardAvoid: {
		flex: 1,
	},
	overlay: {
		flex: 1,
		justifyContent: "flex-end",
	},
	overlayBackground: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContainer: {
		backgroundColor: colors.white,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		paddingTop: 12,
		paddingHorizontal: 24,
		paddingBottom: 40,
	},
	handle: {
		width: 40,
		height: 4,
		backgroundColor: colors.grey,
		borderRadius: 2,
		alignSelf: "center",
		marginBottom: 20,
	},
});

export default BottomSheetModal;
