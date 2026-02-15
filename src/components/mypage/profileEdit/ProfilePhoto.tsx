import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
        <Ionicons name="settings-outline" size={15} color="#8A8A8A" />
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
    backgroundColor: "#D9E5F2",
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCDCDC",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProfilePhoto;
