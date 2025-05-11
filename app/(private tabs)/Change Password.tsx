import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { Appbar, TextInput, Button, Text, Snackbar } from "react-native-paper";
import { useAppTheme } from "@/hooks/themeContext";
import { changePassword } from "@/utils/settingsService";

export default function ChangePasswordScreen() {
  const { theme } = useAppTheme();
  const navigation = useNavigation();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [userId, setUserId] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    isError: false,
  });

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUser = await SecureStore.getItemAsync("userData");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUserId(parsed.id);
      }
    };
    fetchUserId();
  }, []);

  const handleChangePassword = async () => {
    const newErrors = { currentPassword: "", newPassword: "", confirmNewPassword: "" };

    if (!currentPassword) newErrors.currentPassword = "Current password is required.";
    if (newPassword.length < 8) newErrors.newPassword = "New password must be at least 8 characters.";
    if (newPassword !== confirmNewPassword) newErrors.confirmNewPassword = "Passwords do not match.";

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((msg) => msg !== "");
    if (hasErrors) return;

    try {
      const res = await changePassword({ userId, currentPassword, newPassword });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      setSnackbar({
        visible: true,
        message: res.message || "Password changed successfully",
        isError: false,
      });
    } catch (res: any) {
      const msg = res.message || "Something went wrong";
      setSnackbar({
        visible: true,
        message: msg,
        isError: true,
      });
    }
  };

  return (
    <>
      <Appbar.Header elevated theme={{ colors: { primary: theme.colors.background } }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Change Password" />
      </Appbar.Header>

      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <TextInput
          label="Current Password"
          mode="outlined"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry={!showCurrent}
          right={
            <TextInput.Icon
              icon={showCurrent ? "eye-off" : "eye"}
              onPress={() => setShowCurrent(!showCurrent)}
            />
          }
          error={!!errors.currentPassword}
          style={styles.input}
        />
        {errors.currentPassword ? (
          <Text style={styles.errorText}>{errors.currentPassword}</Text>
        ) : null}

        <TextInput
          label="New Password"
          mode="outlined"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showNew}
          right={
            <TextInput.Icon
              icon={showNew ? "eye-off" : "eye"}
              onPress={() => setShowNew(!showNew)}
            />
          }
          error={!!errors.newPassword}
          style={styles.input}
        />
        {errors.newPassword ? (
          <Text style={styles.errorText}>{errors.newPassword}</Text>
        ) : null}

        <TextInput
          label="Confirm New Password"
          mode="outlined"
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          secureTextEntry={!showConfirm}
          right={
            <TextInput.Icon
              icon={showConfirm ? "eye-off" : "eye"}
              onPress={() => setShowConfirm(!showConfirm)}
            />
          }
          error={!!errors.confirmNewPassword}
          style={styles.input}
        />
        {errors.confirmNewPassword ? (
          <Text style={styles.errorText}>{errors.confirmNewPassword}</Text>
        ) : null}

        <Button
          mode="contained"
          onPress={handleChangePassword}
          style={styles.button}
          contentStyle={{ paddingVertical: 10 }}
        >
          Change Password
        </Button>
      </ScrollView>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
        style={{
          backgroundColor: snackbar.isError ? "#dc2626" : theme.colors.primary,
        }}
      >
        {snackbar.message}
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 10,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 13,
    marginBottom: 6,
    marginLeft: 4,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
  },
});
