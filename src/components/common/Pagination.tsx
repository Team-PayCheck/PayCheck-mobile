import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "./Text";
import { colors } from "../../constants/colors";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const getPageNumbers = (current: number, total: number): (number | "...")[] => {
	if (total <= 5) {
		return Array.from({ length: total }, (_, i) => i + 1);
	}

	const pages: (number | "...")[] = [];

	if (current <= 3) {
		// 앞쪽: 1 2 3 4 ... last
		for (let i = 1; i <= 4; i++) pages.push(i);
		pages.push("...");
		pages.push(total);
	} else if (current >= total - 2) {
		// 뒤쪽: 1 ... last-3 last-2 last-1 last
		pages.push(1);
		pages.push("...");
		for (let i = total - 3; i <= total; i++) pages.push(i);
	} else {
		// 중간: 1 ... prev current next ... last
		pages.push(1);
		pages.push("...");
		pages.push(current - 1);
		pages.push(current);
		pages.push(current + 1);
		pages.push("...");
		pages.push(total);
	}

	return pages;
};

const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	onPageChange,
}) => {
	if (totalPages <= 1) return null;

	const displayPage = currentPage + 1; // 0-based → 1-based
	const pages = getPageNumbers(displayPage, totalPages);

	return (
		<View style={styles.container}>
			{/* 이전 */}
			<TouchableOpacity
				style={[styles.arrowButton, displayPage === 1 && styles.arrowButtonDisabled]}
				onPress={() => onPageChange(currentPage - 1)}
				disabled={displayPage === 1}
				activeOpacity={0.7}
			>
				<Text weight="Bold" style={[styles.arrowText, displayPage === 1 && styles.arrowTextDisabled]}>
					{"<"}
				</Text>
			</TouchableOpacity>

			{/* 페이지 번호 */}
			{pages.map((page, index) =>
				page === "..." ? (
					<View key={`ellipsis-${index}`} style={styles.ellipsis}>
						<Text style={styles.ellipsisText}>...</Text>
					</View>
				) : (
					<TouchableOpacity
						key={page}
						style={[styles.pageButton, page === displayPage && styles.pageButtonActive]}
						onPress={() => onPageChange(page - 1)}
						activeOpacity={0.7}
					>
						<Text
							weight={page === displayPage ? "Bold" : "Medium"}
							style={[styles.pageText, page === displayPage && styles.pageTextActive]}
						>
							{page}
						</Text>
					</TouchableOpacity>
				)
			)}

			{/* 다음 */}
			<TouchableOpacity
				style={[styles.arrowButton, displayPage === totalPages && styles.arrowButtonDisabled]}
				onPress={() => onPageChange(currentPage + 1)}
				disabled={displayPage === totalPages}
				activeOpacity={0.7}
			>
				<Text weight="Bold" style={[styles.arrowText, displayPage === totalPages && styles.arrowTextDisabled]}>
					{">"}
				</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		gap: 6,
		paddingVertical: 16,
	},
	arrowButton: {
		width: 36,
		height: 36,
		borderRadius: 8,
		backgroundColor: colors.textPrimary,
		alignItems: "center",
		justifyContent: "center",
	},
	arrowButtonDisabled: {
		backgroundColor: colors.disabled,
	},
	arrowText: {
		fontSize: 16,
		color: colors.white,
	},
	arrowTextDisabled: {
		color: colors.textDisabled,
	},
	pageButton: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
	},
	pageButtonActive: {
		backgroundColor: colors.primary,
	},
	pageText: {
		fontSize: 15,
		color: colors.textSecondary,
	},
	pageTextActive: {
		color: colors.white,
	},
	ellipsis: {
		width: 24,
		height: 36,
		alignItems: "center",
		justifyContent: "center",
	},
	ellipsisText: {
		fontSize: 15,
		color: colors.textMuted,
	},
});

export default Pagination;
