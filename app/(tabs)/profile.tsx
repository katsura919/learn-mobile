import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { fetchHomeStats } from "../../utils/profileServices"; // Assuming the fetchHomeStats is still used for stats fetching

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalLessons: 0,
    totalAttempts: 0,
    averageScore: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve user data from SecureStore
        const userData = await SecureStore.getItemAsync("userData");
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUser(parsedUserData);

          // Fetch user stats using the user ID from the stored data
          const statsData = await fetchHomeStats(parsedUserData.id);
          setStats(statsData);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load profile info.");
        console.error(error);
      }
    };

    fetchData();
  }, []);



  if (!user) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={() => router.push("/Settings")}>
          <Ionicons name="settings-outline" size={24} color="#4B5563" />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileCard}>
        <Image source={{ uri: user.profilePic }} style={styles.avatar} />
        <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
        <Text style={styles.username}>@{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalLessons}</Text>
          <Text style={styles.statLabel}>Lessons</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalAttempts}</Text>
          <Text style={styles.statLabel}>Quiz Attempts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.averageScore.toFixed(0)}%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  profileCard: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111827",
  },
  username: {
    fontSize: 16,
    color: "#6b7280",
  },
  email: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    marginTop: 32,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
