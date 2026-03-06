import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../constants/colors";
import { getNotifications, getUnreadCount, readNotification } from "../../api/notification";
import type { NotificationResponse } from "../../api/notification/types";
import NotificationPopup from "../common/notification/NotificationPopup";

interface HeaderProps {
  onPressLeft?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onPressLeft }) => {
  const navigation = useNavigation<any>();
  const [popupVisible, setPopupVisible] = useState(false);
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    getUnreadCount()
      .then((res) => {
        if (res.success && res.data) setUnreadCount(res.data.count);
      })
      .catch(() => {});
  }, []);

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
          setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch {}
      }
      setPopupVisible(false);
    },
    []
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
        {unreadCount > 0 && <View style={styles.badge} />}
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
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.deleteRed,
  },
});

export default Header;
