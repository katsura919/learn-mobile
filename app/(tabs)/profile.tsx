import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Appbar, Card, Text, useTheme, Avatar } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { fetchHomeStats } from "../../utils/profileServices";
import { useAppTheme } from "@/hooks/themeContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const paperTheme = useTheme();

  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalLessons: 0,
    totalAttempts: 0,
    averageScore: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await SecureStore.getItemAsync("userData");
        if (userData) {
          const parsed = JSON.parse(userData);
          setUser(parsed);
          const statsData = await fetchHomeStats(parsed.id);
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Appbar.Header mode="small" style={{ backgroundColor: theme.colors.background }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Profile" titleStyle={{ color: theme.colors.onBackground, fontFamily: 'Inter-Medium', fontSize: 16,  }} />
        <Appbar.Action icon="cog-outline" onPress={() => router.push("/Settings")} />
      </Appbar.Header>

      {/* Profile Info */}
      <Card style={[styles.profileCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={{ alignItems: "center" }}>
          <Avatar.Image
                     size={90}
                     source={
                       user?.profilePic
                         ? { uri: user.profilePic }
                         : require('@/assets/images/profile.png')
                     }
                     style={styles.avatar}
            />
           
          <Text variant="titleLarge" style={{ color: theme.colors.onBackground, fontFamily: 'Inter-Medium', fontSize: 16 }}>
            {user.firstName} {user.lastName}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onBackground, fontFamily: 'Inter-Regular', fontSize: 12, opacity: 0.7 }}>
            @{user.username}
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onBackground, fontFamily: 'Inter-Regular', fontSize: 12, opacity: 0.5 }}>
            {user.email}
          </Text>
        </Card.Content>
      </Card>

      {/* Stats */}
      <Card style={[styles.statsCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={styles.statsContent}>
          <View style={styles.statItem}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontFamily: 'Inter-Regular' }}>
              {stats.totalLessons}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurface, fontFamily: 'Inter-Regular',opacity: 0.6 }}>
              Lessons
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontFamily: 'Inter-Regular' }}>
              {stats.totalAttempts}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurface, fontFamily: 'Inter-Regular', opacity: 0.6 }}>
              Quiz Attempts
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontFamily: 'Inter-Regular'}}>
              {stats.averageScore.toFixed(0)}%
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurface, fontFamily: 'Inter-Regular', opacity: 0.6 }}>
              Accuracy
            </Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCard: {
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    elevation: 2,
  },
  avatar: {
    borderRadius: 50,
    marginBottom: 12,
  },
  statsCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    elevation: 1,
  },
  statsContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
  },
  statItem: {
    alignItems: "center",
  },
});
