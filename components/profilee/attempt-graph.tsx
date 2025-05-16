import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  Dimensions,
  ScrollView,
  StyleSheet,
} from "react-native";
import Svg, {
  Polyline,
  Line,
  Circle,
  Text as SvgText,
  G,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";
import * as SecureStore from "expo-secure-store";
import { useAppTheme } from "@/hooks/themeContext";

const { width: screenWidth } = Dimensions.get("window");
const GRAPH_HEIGHT = 240;
const GRAPH_PADDING = 40;
const POINT_SPACING = 48;
const CHART_MARGIN = 16;

export default function AttemptGraph() {
  const { theme } = useAppTheme();
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState<number[]>([]);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const userData = await SecureStore.getItemAsync("userData");
        if (userData) {
          const { id } = JSON.parse(userData);
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/attempts/allattempts/${id}`
          );
          const data = await response.json();
          const scores = (data.attempts || []).map((a: any) =>
            Math.min(Math.round(a.score), 100)
          );
          setAttempts(scores);
        }
      } catch (error) {
        console.error("Failed to fetch attempts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }

  if (attempts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.onBackground }]}>
          No attempts recorded yet
        </Text>
      </View>
    );
  }

  // Chart calculations
  const maxValue = 100;
  const chartWidth = Math.max(
    screenWidth - CHART_MARGIN * 2,
    POINT_SPACING * (attempts.length - 1) + GRAPH_PADDING * 2
  );
  const stepX = POINT_SPACING;
  const stepY = (GRAPH_HEIGHT - GRAPH_PADDING * 2) / maxValue;

  const getY = (value: number) => GRAPH_HEIGHT - GRAPH_PADDING - value * stepY;
  const getX = (index: number) => GRAPH_PADDING + index * stepX;

  const generatePath = () => {
    if (attempts.length < 2) return "";
    let d = `M ${getX(0)} ${getY(attempts[0])}`;
    for (let i = 1; i < attempts.length; i++) {
      const x = getX(i);
      const y = getY(attempts[i]);
      const prevX = getX(i - 1);
      const prevY = getY(attempts[i - 1]);
      const cx = (prevX + x) / 2;
      d += ` Q ${cx} ${prevY}, ${x} ${y}`;
    }
    return d;
  };

  const generateAreaPath = () => {
    if (attempts.length < 2) return "";
    let d = `M ${getX(0)} ${getY(attempts[0])}`;
    for (let i = 1; i < attempts.length; i++) {
      const x = getX(i);
      const y = getY(attempts[i]);
      const prevX = getX(i - 1);
      const prevY = getY(attempts[i - 1]);
      const cx = (prevX + x) / 2;
      d += ` Q ${cx} ${prevY}, ${x} ${y}`;
    }
    d += ` L ${getX(attempts.length - 1)} ${GRAPH_HEIGHT - GRAPH_PADDING}`;
    d += ` L ${getX(0)} ${GRAPH_HEIGHT - GRAPH_PADDING}`;
    d += " Z";
    return d;
  };

  return (
    <View style={[styles.container, { marginTop: 24 }]}>
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.onBackground,
            fontFamily: "Inter-SemiBold",
          },
        ]}
      >
        Quiz Performance History
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <Svg height={GRAPH_HEIGHT} width={chartWidth}>
          <Defs>
            <LinearGradient
              id="areaGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <Stop
                offset="0%"
                stopColor={theme.colors.primary}
                stopOpacity="0.2"
              />
              <Stop
                offset="100%"
                stopColor={theme.colors.primary}
                stopOpacity="0"
              />
            </LinearGradient>
          </Defs>

          <G>
            {/* Y-axis grid and labels */}
            {[0, 25, 50, 75, 100].map((value) => {
              const y = getY(value);
              return (
                <G key={value}>
                  <Line
                    x1={GRAPH_PADDING}
                    y1={y}
                    x2={chartWidth}
                    y2={y}
                    stroke={theme.colors.outline}
                    strokeDasharray="4,2"
                    strokeWidth="0.5"
                  />
                  <SvgText
                    x={GRAPH_PADDING - 12}
                    y={y + 5}
                    fontSize="12"
                    fill={theme.colors.onSurfaceVariant}
                    textAnchor="end"
                    fontFamily="Inter-Regular"
                  >
                    {value}%
                  </SvgText>
                </G>
              );
            })}

            {/* X-axis labels */}
            {attempts.map((_, index) => {
              const x = getX(index);
              return (
                <G key={index}>
                  <Line
                    x1={x}
                    y1={GRAPH_HEIGHT - GRAPH_PADDING}
                    x2={x}
                    y2={GRAPH_HEIGHT - GRAPH_PADDING + 8}
                    stroke={theme.colors.outline}
                    strokeWidth="1"
                  />
                  <SvgText
                    x={x}
                    y={GRAPH_HEIGHT - GRAPH_PADDING + 24}
                    fontSize="12"
                    fill={theme.colors.onSurfaceVariant}
                    textAnchor="middle"
                    fontFamily="Inter-Regular"
                  >
                    {index + 1}
                  </SvgText>
                </G>
              );
            })}

            {/* Area fill */}
            <Path
              d={generateAreaPath()}
              fill="url(#areaGradient)"
              stroke="transparent"
            />

            {/* Smooth path */}
            <Path
              d={generatePath()}
              fill="none"
              stroke={theme.colors.primary}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {attempts.map((score, index) => {
              const x = getX(index);
              const y = getY(score);
              return (
                <G key={index}>
                  <Circle
                    cx={x}
                    cy={y}
                    r="5"
                    fill={theme.colors.background}
                    stroke={theme.colors.primary}
                    strokeWidth="2"
                  />
                  <SvgText
                    x={x}
                    y={y - 10}
                    fontSize="10"
                    fill={theme.colors.primary}
                    textAnchor="middle"
                    fontFamily="Inter-SemiBold"
                  >
                    {score}%
                  </SvgText>
                </G>
              );
            })}
          </G>
        </Svg>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: theme.colors.primary },
            ]}
          />
          <Text
            style={[styles.legendText, { color: theme.colors.onBackground }]}
          >
            Your Score
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: CHART_MARGIN,
  },
  scrollContainer: {
    paddingRight: CHART_MARGIN,
  },
  loadingContainer: {
    height: GRAPH_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    height: GRAPH_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: CHART_MARGIN,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
    paddingHorizontal: CHART_MARGIN,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    paddingHorizontal: CHART_MARGIN,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
  },
});