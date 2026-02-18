import React from "react";
import { View, TextInput, StyleSheet, KeyboardTypeOptions, TouchableOpacity, ViewStyle, TextStyle } from "react-native";
import { Text } from "../../common/Text";
import { colors } from "../../../constants/colors";

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
        placeholderTextColor={colors.textSecondary}
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
    color: colors.textSecondary,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: colors.backgroundGrey,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    fontSize: 15,
    color: colors.textSecondary,
    fontFamily: "Pretendard-Medium",
  },
  readOnlyInput: {
    color: colors.textSecondary,
  },
  editButton: {
    width: 42,
    height: 33,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});

export default ProfileFieldRow;
