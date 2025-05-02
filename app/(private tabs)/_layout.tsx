import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="Settings" options={{headerShown: false}}/>
      <Stack.Screen name="Change Password" options={{headerShown: false}}/>
      <Stack.Screen name="Profile Settings" options={{headerShown: false}}/>
    </Stack>
  );
}
