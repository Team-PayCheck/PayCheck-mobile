import React from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "../common/Text";
import { colors } from "../../constants/colors";

/** 카드 헤더에 필요한 목록 수준 데이터 */
export interface RequestCardSummary {
	type: string;
	status: string;
	workDate: string;
	requestedStartTime: string;
	requestedEndTime: string;
}

/** 확장 영역에 필요한 상세 데이터 */
export interface RequestCardDetail {
	type: string;
	originalWorkDate: string | null;
	originalStartTime: string | null;
	originalEndTime: string | null;
	requestedWorkDate: string;
	requestedStartTime: string;
	requestedEndTime: string;
	requestedBreakMinutes?: number | null;
	requestedMemo?: string | null;
	reviewedAt?: string | null;
}

export interface BaseRequestCardProps {
	request: RequestCardSummary;
	headerSubtitle: string;
	expanded: boolean;
	onToggle: () => void;
	detail: RequestCardDetail | null;
	isDetailLoading: boolean;
	/** "요청 유형" 아래에 삽입할 추가 상세 필드 */
	extraDetailFields?: React.ReactNode;
	/** 상세 영역 하단 액션 버튼 */
	actionButtons?: React.ReactNode;
	/** 거절 상태 pill 배경색 (기본: colors.red) */
	rejectedPillColor?: string;
	/** 거절 상태 pill 텍스트 색 (기본: colors.white) */
	rejectedTextColor?: string;
}

const TYPE_LABEL: Record<string, string> = {
	CREATE: "추가",
	UPDATE: "수정",
	DELETE: "삭제",
};

const STATUS_CONFIG: Record<string, { label: string; key: "pending" | "approved" | "rejected" }> = {
	PENDING: { label: "대기", key: "pending" },
	APPROVED: { label: "승인", key: "approved" },
	REJECTED: { label: "거절", key: "rejected" },
};

const PILL_BG: Record<string, string> = {
	pending: colors.blue,
	approved: colors.green,
};

/** "HH:mm" or "HH:mm:ss" → { hour, min } */
export const parseTime = (time: string | null) => {
	if (!time) return { hour: "--", min: "--" };
	const [h, m] = time.split(":");
	return { hour: h, min: m };
};

/** "2026-02-18" → "2/18" */
export const formatShortDate = (date: string) => {
	const d = new Date(date);
	return `${d.getMonth() + 1}/${d.getDate()}`;
};

/** "2026-02-18" → "2026.02.18" */
export const formatFullDate = (date: string) => date.replace(/-/g, ".");

const BaseRequestCard: React.FC<BaseRequestCardProps> = ({
	request,
	headerSubtitle,
	expanded,
	onToggle,
	detail,
	isDetailLoading,
	extraDetailFields,
	actionButtons,
	rejectedPillColor = colors.red,
	rejectedTextColor = colors.white,
}) => {
	const statusConfig = STATUS_CONFIG[request.status] ?? { label: request.status, key: "pending" };
	const typeLabel = TYPE_LABEL[request.type] ?? request.type;
	const reqStart = parseTime(request.requestedStartTime);
	const reqEnd = parseTime(request.requestedEndTime);

	const pillBg = statusConfig.key === "rejected"
		? rejectedPillColor
		: (PILL_BG[statusConfig.key] ?? colors.blue);
	const pillTextColor = statusConfig.key === "rejected"
		? rejectedTextColor
		: colors.white;

	return (
		<View style={{ marginBottom: 16 }}>
			<View style={[styles.card, expanded && styles.cardExpanded]}>
				{/* 카드 헤더 */}
				<TouchableOpacity style={styles.cardHeaderRow} onPress={onToggle} activeOpacity={0.7}>
					<View style={styles.cardLeft}>
						<View style={styles.typeBadge}>
							<Text weight="Bold" style={styles.typeBadgeText}>{typeLabel}</Text>
						</View>
						<View style={styles.infoCol}>
							<Text weight="Medium" style={styles.subtitle}>{headerSubtitle}</Text>
							<Text weight="Bold" style={styles.timeText}>
								{formatShortDate(request.workDate)} {reqStart.hour}:{reqStart.min} ~ {reqEnd.hour}:{reqEnd.min}
							</Text>
						</View>
					</View>
					<View style={styles.cardRight}>
						<View style={[styles.statusPill, { backgroundColor: pillBg }]}>
							<Text weight="Medium" style={{ color: pillTextColor, fontSize: 13 }}>
								{statusConfig.label}
							</Text>
						</View>
						<Feather
							name={expanded ? "chevron-up" : "chevron-down"}
							size={22}
							color={colors.textSecondary}
							style={{ marginLeft: 6 }}
						/>
					</View>
				</TouchableOpacity>

				{/* 카드 상세 */}
				{expanded && (
					<View style={styles.detailBox}>
						{isDetailLoading ? (
							<ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
						) : detail ? (
							<View style={styles.detailGapCol}>
								{/* 요청 유형 */}
								<View>
									<Text style={styles.detailLabel}>요청 유형</Text>
									<View style={styles.detailValueBox}>
										<Text style={styles.detailValueText}>근무 {typeLabel} 요청</Text>
									</View>
								</View>

								{/* 추가 상세 필드 (ReceivedRequestCard: 요청자) */}
								{extraDetailFields}

								{/* 기존 근무 시간 (UPDATE/DELETE) */}
								{detail.type !== "CREATE" && detail.originalStartTime && (
									<View>
										<Text style={styles.detailLabel}>기존 근무 시간</Text>
										<View style={styles.detailTimeRow}>
											<View style={styles.detailDateBox}>
												<Text style={styles.detailValueText}>{formatFullDate(detail.originalWorkDate!)}</Text>
											</View>
											<View style={styles.detailHourRow}>
												<View style={styles.detailHourBox}>
													<Text style={styles.detailValueText}>
														{parseTime(detail.originalStartTime).hour}:{parseTime(detail.originalStartTime).min}
													</Text>
												</View>
												<Text style={styles.detailTilde}>~</Text>
												<View style={styles.detailHourBox}>
													<Text style={styles.detailValueText}>
														{parseTime(detail.originalEndTime!).hour}:{parseTime(detail.originalEndTime!).min}
													</Text>
												</View>
											</View>
										</View>
									</View>
								)}

								{/* 요청 근무 시간 */}
								<View>
									<Text style={styles.detailLabel}>요청 근무 시간</Text>
									<View style={styles.detailTimeRow}>
										<View style={styles.detailDateBox}>
											<Text style={styles.detailValueText}>{formatFullDate(detail.requestedWorkDate)}</Text>
										</View>
										<View style={styles.detailHourRow}>
											<View style={styles.detailHourBox}>
												<Text style={styles.detailValueText}>
													{parseTime(detail.requestedStartTime).hour}:{parseTime(detail.requestedStartTime).min}
												</Text>
											</View>
											<Text style={styles.detailTilde}>~</Text>
											<View style={styles.detailHourBox}>
												<Text style={styles.detailValueText}>
													{parseTime(detail.requestedEndTime).hour}:{parseTime(detail.requestedEndTime).min}
												</Text>
											</View>
										</View>
									</View>
								</View>

								{/* 휴게 시간 */}
								{detail.requestedBreakMinutes != null && (
									<View>
										<Text style={styles.detailLabel}>휴게 시간</Text>
										<View style={styles.detailValueBox}>
											<Text style={styles.detailValueText}>{detail.requestedBreakMinutes}분</Text>
										</View>
									</View>
								)}

								{/* 메모 */}
								{detail.requestedMemo && (
									<View>
										<Text style={styles.detailLabel}>메모</Text>
										<View style={styles.detailValueBox}>
											<Text style={styles.detailValueText}>{detail.requestedMemo}</Text>
										</View>
									</View>
								)}

								{/* 처리 일시 */}
								{detail.reviewedAt && (
									<View>
										<Text style={styles.detailLabel}>처리 일시</Text>
										<View style={styles.detailValueBox}>
											<Text style={styles.detailValueText}>
												{formatFullDate(detail.reviewedAt.split("T")[0])} {detail.reviewedAt.split("T")[1]?.slice(0, 5)}
											</Text>
										</View>
									</View>
								)}

								{/* 액션 버튼 */}
								{actionButtons}
							</View>
						) : (
							<Text style={styles.detailLabel}>상세 정보를 불러올 수 없습니다.</Text>
						)}
					</View>
				)}
			</View>
		</View>
	);
};

export const baseRequestCardStyles = StyleSheet.create({
	detailLabel: {
		color: colors.textSecondary,
		fontSize: 13,
		marginBottom: 6,
	},
	detailValueBox: {
		backgroundColor: colors.backgroundGrey,
		borderRadius: 8,
		padding: 10,
		borderWidth: 1,
		borderColor: colors.borderLight,
	},
	detailValueText: {
		color: colors.textPrimary,
		fontSize: 15,
	},
});

const styles = StyleSheet.create({
	card: {
		backgroundColor: colors.white,
		borderRadius: 18,
		paddingHorizontal: 18,
		paddingVertical: 14,
		shadowColor: colors.black,
		shadowOpacity: 0.07,
		shadowOffset: { width: 0, height: 3 },
		shadowRadius: 8,
		elevation: 3,
	},
	cardExpanded: {
		paddingBottom: 0,
	},
	cardHeaderRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	cardLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		flex: 1,
	},
	typeBadge: {
		width: 38,
		height: 38,
		borderRadius: 19,
		backgroundColor: colors.primaryLight,
		alignItems: "center",
		justifyContent: "center",
	},
	typeBadgeText: {
		fontSize: 13,
		color: colors.primary,
	},
	infoCol: {
		flex: 1,
	},
	subtitle: {
		fontSize: 13,
		color: colors.textSecondary,
		marginBottom: 2,
	},
	timeText: {
		fontSize: 16,
		color: colors.textPrimary,
	},
	cardRight: {
		flexDirection: "row",
		alignItems: "center",
	},
	statusPill: {
		minWidth: 52,
		height: 28,
		borderRadius: 14,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 12,
		marginRight: 2,
	},
	detailBox: {
		marginTop: 18,
		marginBottom: 20,
	},
	detailGapCol: {
		gap: 14,
	},
	detailLabel: {
		color: colors.textSecondary,
		fontSize: 13,
		marginBottom: 6,
	},
	detailValueBox: {
		backgroundColor: colors.backgroundGrey,
		borderRadius: 8,
		padding: 10,
		borderWidth: 1,
		borderColor: colors.borderLight,
	},
	detailValueText: {
		color: colors.textPrimary,
		fontSize: 15,
	},
	detailTimeRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	detailDateBox: {
		backgroundColor: colors.backgroundGrey,
		borderRadius: 8,
		paddingVertical: 10,
		paddingHorizontal: 12,
		borderWidth: 1,
		borderColor: colors.borderLight,
		alignItems: "center",
	},
	detailHourRow: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
	},
	detailHourBox: {
		flex: 1,
		backgroundColor: colors.backgroundGrey,
		borderRadius: 8,
		paddingVertical: 10,
		paddingHorizontal: 8,
		borderWidth: 1,
		borderColor: colors.borderLight,
		alignItems: "center",
	},
	detailTilde: {
		marginHorizontal: 2,
		color: colors.textPrimary,
		fontSize: 15,
	},
});

export default BaseRequestCard;
