import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import * as SecureStore from "expo-secure-store";
import { LineChart } from "react-native-gifted-charts";
import { useAppTheme } from "@/hooks/themeContext";

export default function AttemptGraph() {
  const { theme } = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState<any[]>([]);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const userData = await SecureStore.getItemAsync("userData");
        if (userData) {
          const { id } = JSON.parse(userData);
          const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/attempts/allattempts/${id}`);
          const data = await response.json();
          setAttempts(data.attempts || []);
        }
      } catch (error) {
        console.error("Failed to fetch attempts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  if (attempts.length === 0) {
    return (
      <View style={{ marginTop: 20 }}>
        <Text style={{ color: theme.colors.onBackground, textAlign: "center" }}>No attempts yet.</Text>
      </View>
    );
  }

  // Transform data for the chart
  const chartData = attempts.map((attempt, index) => ({
    value: attempt.score,
    label: `#${index + 1}`,
    labelTextStyle: { color: theme.colors.onBackground, fontSize: 10 },
    frontColor: theme.colors.primary,
  }));

  return (
    <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
      <Text style={{ color: theme.colors.onBackground, fontSize: 16, marginBottom: 8 }}>
        Quiz Score Progress
      </Text>
      <LineChart
        data={chartData}
        areaChart
        curved
        hideDataPoints={false}
        startFillColor={theme.colors.primary}
        startOpacity={0.3}
        endOpacity={0.1}
        thickness={2}
        color={theme.colors.primary}
        hideRules
        yAxisColor="transparent"
        xAxisColor="transparent"
        noOfSections={4}
        animateOnDataChange
        animationDuration={800}
        isAnimated
        maxValue={100}
      />
    </View>
  );
}
