import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
export default function ProfileScreen() {
    const router = useRouter();
  
    async function handleLogout() {
      await SecureStore.deleteItemAsync("userToken");
      router.replace("/login");
    }
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>👤 Profile Screen</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
