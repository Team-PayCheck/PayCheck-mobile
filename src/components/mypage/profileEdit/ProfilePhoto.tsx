import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../constants/colors";

interface ProfilePhotoProps {
  imageSource: any;
  onPressSetting?: () => void;
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({ imageSource, onPressSetting }) => {
  return (
    <View style={styles.profilePhotoWrapper}>
      <View style={styles.profilePhoto}>
        <Image source={imageSource} style={styles.profileImage} resizeMode="contain" />
      </View>
      <TouchableOpacity style={styles.settingButton} activeOpacity={0.8} onPress={onPressSetting}>
        <Ionicons name="settings-outline" size={15} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profilePhotoWrapper: {
    position: "relative",
    width: 86,
    height: 86,
  },
  profilePhoto: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 48,
    height: 48,
  },
  settingButton: {
    position: "absolute",
    right: -2,
    bottom: -1,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProfilePhoto;
