import React, { useState, useCallback } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Text } from "../common/Text";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../constants/colors";
import { getNotifications, readNotification } from "../../api/notification";
import { useNotificationStore } from "../../stores/notificationStore";
import type { NotificationResponse } from "../../api/notification/types";
import NotificationPopup from "../common/notification/NotificationPopup";

interface HeaderProps {
  onPressLeft?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onPressLeft }) => {
  const navigation = useNavigation<any>();
  const [popupVisible, setPopupVisible] = useState(false);
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const decrementUnreadCount = useNotificationStore((s) => s.decrementUnreadCount);

  const handleBellPress = useCallback(async () => {
    if (popupVisible) {
      setPopupVisible(false);
      return;
    }
    try {
      const res = await getNotifications({ size: 5 });
      if (res.success && res.data) {
        const data = res.data;
        const items = Array.isArray(data) ? data : data.content ?? [];
        setNotifications(items);
      }
    } catch {
      // silent fail
    }
    setPopupVisible(true);
  }, [popupVisible]);

  const handlePressItem = useCallback(
    async (notification: NotificationResponse) => {
      if (!notification.isRead) {
        try {
          await readNotification(notification.id);
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === notification.id ? { ...n, isRead: true } : n
            )
          );
          decrementUnreadCount();
        } catch {}
      }
      setPopupVisible(false);
    },
    [decrementUnreadCount]
  );

  const handleViewAll = useCallback(() => {
    setPopupVisible(false);
    navigation.navigate("Notifications");
  }, [navigation]);

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onPressLeft} activeOpacity={0.8}>
        <Feather name="align-left" size={28} color={colors.textPrimary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleBellPress} activeOpacity={0.8}>
        <Ionicons
          name="notifications-outline"
          size={28}
          color={colors.textPrimary}
        />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text weight="Bold" style={styles.badgeText}>
              {unreadCount > 9 ? "9+" : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <NotificationPopup
        visible={popupVisible}
        onClose={() => setPopupVisible(false)}
        notifications={notifications}
        onPressItem={handlePressItem}
        onPressViewAll={handleViewAll}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.deleteRed,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    color: colors.white,
    lineHeight: 14,
  },
});

export default Header;
