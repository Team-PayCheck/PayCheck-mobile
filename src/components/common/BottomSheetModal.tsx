/**
 * 하단에서 올라오는 모달. overlay fade-in + 컨텐츠 slide-up 애니메이션 포함.
 * handle 영역을 아래로 스와이프하면 모달이 닫힌다.
 */
import React, { useRef, useEffect, useCallback } from "react";
import {
	View,
	Modal,
	StyleSheet,
	TouchableOpacity,
	Animated,
	PanResponder,
	Dimensions,
	Keyboard,
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
const SWIPE_THRESHOLD = 100;

const BottomSheetModal: React.FC<BottomSheetModalProps> = ({
	visible,
	onClose,
	children,
	maxHeight = "90%",
}) => {
	const slideAnim = useRef(new Animated.Value(0)).current;
	const overlayAnim = useRef(new Animated.Value(0)).current;
	const panY = useRef(new Animated.Value(0)).current;
	const keyboardOffset = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (visible) {
			panY.setValue(0);
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
			panY.setValue(0);
			keyboardOffset.setValue(0);
		}
	}, [visible]);

	useEffect(() => {
		const showEvent =
			Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
		const hideEvent =
			Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

		const showSub = Keyboard.addListener(showEvent, (e) => {
			Animated.timing(keyboardOffset, {
				toValue: -e.endCoordinates.height,
				duration: 150,
				useNativeDriver: true,
			}).start();
		});

		const hideSub = Keyboard.addListener(hideEvent, () => {
			Animated.timing(keyboardOffset, {
				toValue: 0,
				duration: 150,
				useNativeDriver: true,
			}).start();
		});

		return () => {
			showSub.remove();
			hideSub.remove();
		};
	}, []);

	const handleClose = useCallback(() => {
		Keyboard.dismiss();
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
			panY.setValue(0);
			keyboardOffset.setValue(0);
			onClose();
		});
	}, [onClose]);

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: (_, gestureState) =>
				Math.abs(gestureState.dy) > 5,
			onPanResponderMove: (_, gestureState) => {
				if (gestureState.dy > 0) {
					panY.setValue(gestureState.dy);
				}
			},
			onPanResponderRelease: (_, gestureState) => {
				if (gestureState.dy > SWIPE_THRESHOLD) {
					handleClose();
				} else {
					Animated.spring(panY, {
						toValue: 0,
						useNativeDriver: true,
						damping: 20,
						stiffness: 200,
					}).start();
				}
			},
		})
	).current;

	const translateY = slideAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [SCREEN_HEIGHT, 0],
	});

	const combinedTranslateY = Animated.add(
		Animated.add(translateY, panY),
		keyboardOffset
	);

	return (
		<Modal
			visible={visible}
			transparent
			animationType="none"
			onRequestClose={handleClose}
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
						{ transform: [{ translateY: combinedTranslateY }] },
					]}
				>
					<View
						{...panResponder.panHandlers}
						style={styles.handleArea}
					>
						<View style={styles.handle} />
					</View>
					{children}
				</Animated.View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
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
		borderTopLeftRadius: 32,
		borderTopRightRadius: 32,
		paddingTop: 0,
		paddingHorizontal: 24,
		paddingBottom: 40,
	},
	handleArea: {
		paddingVertical: 16,
		alignItems: "center",
	},
	handle: {
		width: 40,
		height: 4,
		backgroundColor: colors.grey,
		borderRadius: 2,
	},
});

export default BottomSheetModal;
