import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useAppTheme } from "@/hooks/themeContext";
import { List, Button, Appbar, useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const paperTheme = useTheme();

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("userToken");
      await SecureStore.deleteItemAsync("userData");
      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", "Failed to log out.");
      console.error(error);
    }
  };

  const handleChangePassword = () => {
    router.push("/Change Password");
  };

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      {/* Header */}
      <Appbar.Header style={{ backgroundColor: "transparent", elevation: 0 }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Settings" titleStyle={{ color: paperTheme.colors.onBackground, fontFamily: 'Inter-Medium', fontSize: 16}} />
      </Appbar.Header>

      {/* Options */}
      <View style={styles.content}>
       <List.Item
          title="Profile"
          left={() => <Ionicons name="person-outline" size={24} color={paperTheme.colors.onSurface} />}
          onPress={handleChangePassword}
          style={[styles.option, { backgroundColor: paperTheme.colors.surface,  }]}
          titleStyle={{ color: paperTheme.colors.onSurface, fontFamily: 'Inter-Regular', fontSize: 13, }}
        />
        <List.Item
          title="Change Password"
          left={() => <Ionicons name="key-outline" size={24} color={paperTheme.colors.onSurface} />}
          onPress={handleChangePassword}
          style={[styles.option, { backgroundColor: paperTheme.colors.surface,  }]}
          titleStyle={{ color: paperTheme.colors.onSurface, fontFamily: 'Inter-Regular', fontSize: 13, }}
        />

        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          buttonColor="#ef4444"
          icon="logout"
          textColor="#fff"
          contentStyle={{ paddingVertical: 8 }}
        >
          Logout
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  option: {
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
    elevation: 1,
    
  },
  logoutButton: {
    marginTop: 32,
    borderRadius: 12,
  },
});
