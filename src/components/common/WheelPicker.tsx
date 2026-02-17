import React, { useRef, useCallback, useEffect } from "react";
import {
	View,
	StyleSheet,
	Animated,
	NativeSyntheticEvent,
	NativeScrollEvent,
} from "react-native";
import { Text } from "./Text";
import { colors } from "../../constants/colors";

export interface WheelPickerItem {
	label: string;
	value: string | number;
}

interface WheelPickerProps {
	items: WheelPickerItem[];
	selectedValue: string | number;
	onValueChange: (value: string | number) => void;
	itemHeight?: number;
	visibleCount?: number;
	width?: number;
}

const WheelPicker: React.FC<WheelPickerProps> = ({
	items,
	selectedValue,
	onValueChange,
	itemHeight = 40,
	visibleCount = 5,
	width = 80,
}) => {
	const scrollY = useRef(new Animated.Value(0)).current;
	const flatListRef = useRef<Animated.FlatList>(null);
	const containerHeight = itemHeight * visibleCount;
	const paddingVertical = itemHeight * Math.floor(visibleCount / 2);

	const initialIndex = items.findIndex(
		(item) => item.value === selectedValue
	);
	const safeInitialIndex = Math.max(0, initialIndex);

	// selectedValue 변경 시 스크롤 위치 동기화
	useEffect(() => {
		const index = items.findIndex((item) => item.value === selectedValue);
		if (index >= 0 && flatListRef.current) {
			setTimeout(() => {
				(flatListRef.current as any)?.scrollToIndex({
					index,
					animated: false,
				});
			}, 0);
		}
	}, [selectedValue]);

	const handleMomentumScrollEnd = useCallback(
		(e: NativeSyntheticEvent<NativeScrollEvent>) => {
			const offsetY = e.nativeEvent.contentOffset.y;
			const index = Math.round(offsetY / itemHeight);
			const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
			onValueChange(items[clampedIndex].value);
		},
		[items, itemHeight, onValueChange]
	);

	const renderItem = useCallback(
		({ item, index }: { item: WheelPickerItem; index: number }) => {
			const inputRange = [
				(index - 2) * itemHeight,
				(index - 1) * itemHeight,
				index * itemHeight,
				(index + 1) * itemHeight,
				(index + 2) * itemHeight,
			];

			const scale = scrollY.interpolate({
				inputRange,
				outputRange: [0.7, 0.85, 1, 0.85, 0.7],
				extrapolate: "clamp",
			});

			const opacity = scrollY.interpolate({
				inputRange,
				outputRange: [0.3, 0.5, 1, 0.5, 0.3],
				extrapolate: "clamp",
			});

			return (
				<Animated.View
					style={[
						styles.item,
						{
							height: itemHeight,
							transform: [{ scale }],
							opacity,
						},
					]}
				>
					<Text weight="SemiBold" style={styles.itemText}>
						{item.label}
					</Text>
				</Animated.View>
			);
		},
		[scrollY, itemHeight]
	);

	return (
		<View style={[styles.container, { height: containerHeight, width }]}>
			{/* 선택 영역 하이라이트 */}
			<View
				style={[
					styles.highlight,
					{
						top: paddingVertical,
						height: itemHeight,
					},
				]}
				pointerEvents="none"
			/>
			<Animated.FlatList
				ref={flatListRef}
				data={items}
				keyExtractor={(_, index) => index.toString()}
				renderItem={renderItem}
				showsVerticalScrollIndicator={false}
				snapToInterval={itemHeight}
				decelerationRate="fast"
				bounces={true}
				initialScrollIndex={safeInitialIndex}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: true }
				)}
				onMomentumScrollEnd={handleMomentumScrollEnd}
				contentContainerStyle={{
					paddingVertical,
				}}
				getItemLayout={(_, index) => ({
					length: itemHeight,
					offset: itemHeight * index,
					index,
				})}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		overflow: "hidden",
	},
	highlight: {
		position: "absolute",
		left: 0,
		right: 0,
		backgroundColor: colors.backgroundGrey,
		borderRadius: 8,
		zIndex: -1,
	},
	item: {
		justifyContent: "center",
		alignItems: "center",
	},
	itemText: {
		fontSize: 16,
		color: colors.textPrimary,
	},
});

export default WheelPicker;
