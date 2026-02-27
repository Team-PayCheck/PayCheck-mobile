/**
 * Pretendard 폰트가 적용된 공통 Text 컴포넌트.
 * RN 기본 Text 대신 이 컴포넌트를 사용해야 한다.
 */
import React from "react";
import { Text as RNText, TextStyle, StyleProp, TextProps } from "react-native";

type FontWeight = "Regular" | "Medium" | "SemiBold" | "Bold" | "ExtraBold";

interface AppTextProps extends TextProps {
	weight?: FontWeight;
	style?: StyleProp<TextStyle>;
	children: React.ReactNode;
}

export function Text({
	weight = "Regular",
	style,
	children,
	...props
}: AppTextProps) {
	return (
		<RNText
			style={[{ fontFamily: `Pretendard-${weight}` }, style]}
			{...props}
		>
			{children}
		</RNText>
	);
}

export default Text;
