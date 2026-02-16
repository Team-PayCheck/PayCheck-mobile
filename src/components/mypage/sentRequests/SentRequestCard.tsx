import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "../../common/Text";

export interface SentRequestCardProps {
  request: any;
  expanded: boolean;
  onToggle: () => void;
}

const SentRequestCard: React.FC<SentRequestCardProps> = ({ request, expanded, onToggle }) => {
  const r = request;
  return (
    <View style={{ marginBottom: 24 }}>
      <View style={[styles.card, expanded && styles.cardExpanded]}>
        {/* 카드 헤더 */}
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardLeft}>
            <Image
              source={r.image}
              style={styles.profileImg}
              resizeMode="cover"
            />
            <View style={styles.infoCol}>
              <Text weight="Medium" style={styles.profileName}>{r.workplace}</Text>
              <Text weight="Bold" style={styles.timeText}>{`${r.date} ${r.time}`}</Text>
            </View>
          </View>
          <View style={styles.cardRight}>
            <View style={[styles.statusPill, r.status === "대기" ? styles.statusPending : styles.statusApproved]}>
              <Text weight="Medium" style={r.status === "대기" ? styles.statusPendingText : styles.statusApprovedText}>{r.status}</Text>
            </View>
            <Feather
              name={expanded ? "chevron-up" : "chevron-down"}
              size={22}
              color="#353535"
              style={{ marginLeft: 6 }}
              onPress={onToggle}
            />
          </View>
        </View>
        {/* 카드 상세 */}
        {expanded && (
          <View style={styles.detailBox}>
            <View style={styles.detailGapCol}>
              <Text style={styles.detailLabel}>근무지</Text>
              <View style={styles.detailValueBox}>
                <Text style={styles.detailValueText}>{r.detail.workplaceName}</Text>
              </View>
              <Text style={styles.detailLabel}>근무 시간</Text>
              <View style={styles.detailTimeRow}>
                <View style={styles.detailDateBox}>
                  <Text style={styles.detailValueText}>{r.detail.workDate}</Text>
                </View>
                <View style={styles.detailHourRow}>
                  <View style={styles.detailHourBox}>
                    <Text style={styles.detailValueText}>{r.detail.startHour}</Text>
                  </View>
                  <Text>:</Text>
                  <View style={styles.detailHourBox}>
                    <Text style={styles.detailValueText}>{r.detail.startMin}</Text>
                  </View>
                  <Text style={styles.detailTilde}>~</Text>
                  <View style={styles.detailHourBox}>
                    <Text style={styles.detailValueText}>{r.detail.endHour}</Text>
                  </View>
                  <Text>:</Text>
                  <View style={styles.detailHourBox}>
                    <Text style={styles.detailValueText}>{r.detail.endMin}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.detailRowWithGap}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailLabel}>휴게 시간</Text>
                  <View style={styles.detailWageBox}>
                    <Text style={styles.detailValueText}>{r.detail.breakMin}</Text>
                    <Text style={styles.detailUnit}>분</Text>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.detailLabel}>시급</Text>
                  <View style={styles.detailWageBox}>
                    <Text style={styles.detailValueText}>{r.detail.wage}</Text>
                    <Text style={styles.detailUnit}>원</Text>
                  </View>
                </View>
              </View>
              <View style={styles.detailActionRow}>
                <Text style={styles.detailEdit}>수정</Text>
                <Text style={styles.detailDelete}>삭제</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 0,
  },
  cardExpanded: {
    paddingBottom: 0,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailBox: {
    marginTop: 18,
    marginBottom: 32,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileImg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#E0E0E0",
  },
  infoCol: {
    justifyContent: "center",
  },
  profileName: {
    fontSize: 15,
    color: "#848484",
    marginBottom: 2,
  },
  timeText: {
    fontSize: 18,
    color: "#000",
  },
  cardRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  statusPill: {
    minWidth: 60,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
    marginRight: 2,
  },
  statusPending: {
    backgroundColor: "#2563eb",
  },
  statusApproved: {
    backgroundColor: "#ededed",
  },
  statusPendingText: {
    color: "#fff",
    fontSize: 15,
  },
  statusApprovedText: {
    color: "#b0b0b0",
    fontSize: 15,
  },

  detailGapCol: {
    gap: 14,
  },
  detailLabel: {
    color: "#848484",
    fontSize: 15,
    marginBottom: 2,
  },
  detailValueBox: {
    backgroundColor: "#fafafa",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ededed",
  },
  detailValueText: {
    color: "#353535",
    fontSize: 16,
  },
  detailTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailDateBox: {
    backgroundColor: "#fafafa",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ededed",
    minWidth: 56,
    alignItems: "center",
  },
  detailHourRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  detailHourBox: {
    backgroundColor: "#fafafa",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ededed",
    minWidth: 36,
    alignItems: "center",
  },
  detailTilde: {
    marginHorizontal: 4,
  },
  detailRowWithGap: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  detailWageBox: {
    backgroundColor: "#fafafa",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ededed",
    flexDirection: "row",
    alignItems: "center",
  },
  detailUnit: {
    color: "#848484",
    fontSize: 15,
    marginLeft: 2,
  },
  detailActionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 18,
    marginTop: 10,
  },
  detailEdit: {
    color: "#b0b0b0",
    fontSize: 15,
  },
  detailDelete: {
    color: "#ff4d4f",
    fontSize: 15,
  },
});

export default SentRequestCard;
