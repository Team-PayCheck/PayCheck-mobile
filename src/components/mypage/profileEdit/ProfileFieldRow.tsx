import React from "react";
import { View, TextInput, StyleSheet, KeyboardTypeOptions, TouchableOpacity, ViewStyle, TextStyle } from "react-native";
import { Text } from "../../common/Text";

interface ProfileFieldRowProps {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  onEdit?: () => void;
  inputStyle?: TextStyle;
  containerStyle?: ViewStyle;
  children?: React.ReactNode;
}

const ProfileFieldRow: React.FC<ProfileFieldRowProps> = ({
  label,
  value,
  onChangeText,
  editable = true,
  placeholder,
  keyboardType,
  onEdit,
  inputStyle,
  containerStyle,
  children,
}) => {
  return (
    <View style={[styles.fieldRow, containerStyle]}>
      <Text weight="Medium" style={styles.fieldLabel}>{label}</Text>
      {children}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, !editable && styles.readOnlyInput, inputStyle]}
        editable={editable}
        placeholder={placeholder}
        placeholderTextColor="#A4A4A4"
        keyboardType={keyboardType}
      />
      {onEdit && (
        <TouchableOpacity style={styles.editButton} activeOpacity={0.8} onPress={onEdit}>
          <Text weight="Medium" style={styles.editButtonText}>수정</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  fieldLabel: {
    width: 68,
    fontSize: 15,
    color: "#8A8A8A",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    paddingHorizontal: 12,
    fontSize: 15,
    color: "#4B4B4B",
    fontFamily: "Pretendard-Medium",
  },
  readOnlyInput: {
    color: "#5E5E5E",
  },
  editButton: {
    width: 42,
    height: 33,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "#F8F8F8",
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    fontSize: 13,
    color: "#4D4D4D",
  },
});

export default ProfileFieldRow;
