import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";
import type {
  CorrectionRequestListItem,
  CorrectionRequestDetail,
} from "../../../api/employer/types";

interface ReceivedRequestCardProps {
  request: CorrectionRequestListItem;
  expanded: boolean;
  onToggle: () => void;
  detail: CorrectionRequestDetail | null;
  isDetailLoading: boolean;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  isProcessing?: "approve" | "reject" | false;
}

const TYPE_LABEL: Record<string, string> = {
  CREATE: "추가",
  UPDATE: "수정",
  DELETE: "삭제",
};

const STATUS_CONFIG: Record<string, { label: string; style: "pending" | "approved" | "rejected" }> = {
  PENDING: { label: "대기", style: "pending" },
  APPROVED: { label: "승인", style: "approved" },
  REJECTED: { label: "거절", style: "rejected" },
};

const parseTime = (time: string | null) => {
  if (!time) return { hour: "--", min: "--" };
  const [h, m] = time.split(":");
  return { hour: h, min: m };
};

const formatShortDate = (date: string) => {
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

const formatFullDate = (date: string) => date.replace(/-/g, ".");

const ReceivedRequestCard: React.FC<ReceivedRequestCardProps> = ({
  request,
  expanded,
  onToggle,
  detail,
  isDetailLoading,
  onApprove,
  onReject,
  isProcessing,
}) => {
  const statusConfig = STATUS_CONFIG[request.status] ?? { label: request.status, style: "pending" };
  const typeLabel = TYPE_LABEL[request.type] ?? request.type;
  const reqStart = parseTime(request.requestedStartTime);
  const reqEnd = parseTime(request.requestedEndTime);

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
              <Text weight="Medium" style={styles.requesterName}>{request.requester.name}</Text>
              <Text weight="Bold" style={styles.timeText}>
                {formatShortDate(request.workDate)} {reqStart.hour}:{reqStart.min} ~ {reqEnd.hour}:{reqEnd.min}
              </Text>
            </View>
          </View>
          <View style={styles.cardRight}>
            <View style={[styles.statusPill, styles[`status_${statusConfig.style}`]]}>
              <Text weight="Medium" style={styles[`statusText_${statusConfig.style}`]}>{statusConfig.label}</Text>
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

                {/* 요청자 */}
                <View>
                  <Text style={styles.detailLabel}>요청자</Text>
                  <View style={styles.detailValueBox}>
                    <Text style={styles.detailValueText}>{detail.requester.name}</Text>
                  </View>
                </View>

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
                          <Text style={styles.detailValueText}>{parseTime(detail.originalStartTime).hour}</Text>
                        </View>
                        <Text>:</Text>
                        <View style={styles.detailHourBox}>
                          <Text style={styles.detailValueText}>{parseTime(detail.originalStartTime).min}</Text>
                        </View>
                        <Text style={styles.detailTilde}>~</Text>
                        <View style={styles.detailHourBox}>
                          <Text style={styles.detailValueText}>{parseTime(detail.originalEndTime!).hour}</Text>
                        </View>
                        <Text>:</Text>
                        <View style={styles.detailHourBox}>
                          <Text style={styles.detailValueText}>{parseTime(detail.originalEndTime!).min}</Text>
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
                        <Text style={styles.detailValueText}>{parseTime(detail.requestedStartTime).hour}</Text>
                      </View>
                      <Text>:</Text>
                      <View style={styles.detailHourBox}>
                        <Text style={styles.detailValueText}>{parseTime(detail.requestedStartTime).min}</Text>
                      </View>
                      <Text style={styles.detailTilde}>~</Text>
                      <View style={styles.detailHourBox}>
                        <Text style={styles.detailValueText}>{parseTime(detail.requestedEndTime).hour}</Text>
                      </View>
                      <Text>:</Text>
                      <View style={styles.detailHourBox}>
                        <Text style={styles.detailValueText}>{parseTime(detail.requestedEndTime).min}</Text>
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

                {/* 승인/거절 버튼 (PENDING만) */}
                {request.status === "PENDING" && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() => onReject?.(request.id)}
                      disabled={!!isProcessing}
                      activeOpacity={0.7}
                    >
                      <Text weight="SemiBold" style={styles.rejectButtonText}>
                        {isProcessing === "reject" ? "처리 중..." : "거절"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={() => onApprove?.(request.id)}
                      disabled={!!isProcessing}
                      activeOpacity={0.7}
                    >
                      <Text weight="SemiBold" style={styles.approveButtonText}>
                        {isProcessing === "approve" ? "처리 중..." : "승인"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
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
  requesterName: {
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
  status_pending: {
    backgroundColor: colors.blue,
  },
  status_approved: {
    backgroundColor: colors.green,
  },
  status_rejected: {
    backgroundColor: colors.red,
  },
  statusText_pending: {
    color: colors.white,
    fontSize: 13,
  },
  statusText_approved: {
    color: colors.white,
    fontSize: 13,
  },
  statusText_rejected: {
    color: colors.white,
    fontSize: 13,
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
    gap: 4,
  },
  detailHourBox: {
    backgroundColor: colors.backgroundGrey,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    minWidth: 40,
    alignItems: "center",
  },
  detailTilde: {
    marginHorizontal: 6,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 4,
  },
  rejectButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.backgroundGrey,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rejectButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  approveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  approveButtonText: {
    fontSize: 14,
    color: colors.white,
  },
}) as any;

export default ReceivedRequestCard;
