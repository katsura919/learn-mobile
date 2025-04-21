import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="Lesson" options={{ headerShown: false }} />
      <Stack.Screen name="Question" options={{ headerShown: false }} />
      <Stack.Screen name="Quiz" options={{ headerShown: false }} />
      <Stack.Screen name="Lesson List" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(private tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
