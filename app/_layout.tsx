import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React from "react";
import { StatusBar } from "react-native";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider, useAppTheme } from "@/hooks/themeContext"; 

function InnerLayout() {
  const { theme, isDark, toggleTheme } = useAppTheme(); 

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background}
      />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="Lesson" options={{ headerShown: false }} />
        <Stack.Screen name="Question" options={{ headerShown: false }} />
        <Stack.Screen name="Quiz" options={{ headerShown: false }} />
        <Stack.Screen name="Lesson List" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(private tabs)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider> 
        <InnerLayout />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
