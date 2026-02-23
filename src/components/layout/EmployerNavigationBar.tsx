import React from "react";
import { View, Image, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "../common/Text";
import { colors } from "../../constants/colors";

export type EmployerTabName = "home" | "employee" | "transfer";

interface TabItem {
  name: EmployerTabName;
  label: string;
  icon: ReturnType<typeof require>;
  iconPressed: ReturnType<typeof require>;
}

const TAB_ITEMS: TabItem[] = [
  {
    name: "home",
    label: "홈",
    icon: require("../../assets/images/navigationBar/home.png"),
    iconPressed: require("../../assets/images/navigationBar/home_pressed.png"),
  },
  {
    name: "employee",
    label: "직원관리",
    icon: require("../../assets/images/navigationBar/user-check.png"),
    iconPressed: require("../../assets/images/navigationBar/user-check_pressed.png"),
  },
  {
    name: "transfer",
    label: "송금관리",
    icon: require("../../assets/images/navigationBar/database.png"),
    iconPressed: require("../../assets/images/navigationBar/database_pressed.png"),
  },
];

interface EmployerNavigationBarProps {
  activeTab: EmployerTabName;
  onTabPress: (tab: EmployerTabName) => void;
}

const EmployerNavigationBar: React.FC<EmployerNavigationBarProps> = ({
  activeTab,
  onTabPress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {TAB_ITEMS.map((tab) => {
        const isActive = activeTab === tab.name;
        return (
          <Pressable
            key={tab.name}
            style={styles.tabItem}
            onPress={() => onTabPress(tab.name)}
          >
            <Image
              source={isActive ? tab.iconPressed : tab.icon}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text
              weight={isActive ? "SemiBold" : "Regular"}
              style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 6,
    gap: 4,
  },
  icon: {
    width: 24,
    height: 24,
  },
  label: {
    fontSize: 10,
  },
  labelActive: {
    color: colors.textPrimary,
  },
  labelInactive: {
    color: colors.textMuted,
  },
});

export default EmployerNavigationBar;
