import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import PagerView, { PagerViewOnPageSelectedEvent } from "react-native-pager-view";
import PayrollIntroScreen from "../screens/onboarding/PayrollIntroScreen";
import NoticeIntroScreen from "../screens/onboarding/NoticeIntroScreen";
import ScheduleIntroScreen from "../screens/onboarding/ScheduleIntroScreen";
import { colors } from "../constants/colors";

interface OnboardingStackProps {
	onComplete?: () => void;
}

const OnboardingStack: React.FC<OnboardingStackProps> = ({ onComplete }) => {
	const pagerRef = useRef<PagerView>(null);
	const [currentPage, setCurrentPage] = useState(0);

	const handlePageSelected = (e: PagerViewOnPageSelectedEvent) => {
		setCurrentPage(e.nativeEvent.position);
	};

	const handleStartPress = () => {
		if (onComplete) {
			onComplete();
		}
	};

	return (
		<View style={styles.container}>
			<PagerView
				ref={pagerRef}
				style={styles.pagerView}
				initialPage={0}
				onPageSelected={handlePageSelected}
			>
				<View key="0" style={styles.page}>
					<PayrollIntroScreen />
				</View>
				<View key="1" style={styles.page}>
					<NoticeIntroScreen />
				</View>
				<View key="2" style={styles.page}>
					<ScheduleIntroScreen onStartPress={handleStartPress} />
				</View>
			</PagerView>
			<View style={styles.indicatorContainer}>
				<View
					style={[
						styles.indicatorDot,
						currentPage === 0 && styles.indicatorActive,
					]}
				/>
				<View
					style={[
						styles.indicatorDot,
						currentPage === 1 && styles.indicatorActive,
					]}
				/>
				<View
					style={[
						styles.indicatorDot,
						currentPage === 2 && styles.indicatorActive,
					]}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white,
	},
	pagerView: {
		flex: 1,
	},
	page: {
		flex: 1,
	},
	indicatorContainer: {
		position: "absolute",
		bottom: 100,
		left: 0,
		right: 0,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 8,
	},
	indicatorDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: colors.backgroundGrey,
	},
	indicatorActive: {
		backgroundColor: colors.textPrimary,
	},
});

export default OnboardingStack;
