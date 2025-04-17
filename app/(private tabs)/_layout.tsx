import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="Settings"/>
      <Stack.Screen name="Change Password"/>
    </Stack>
  );
}
