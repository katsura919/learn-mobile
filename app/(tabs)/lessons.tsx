import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function LessonsScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>📚 Lessons</Text>

      <TouchableOpacity
        onPress={() => router.push("/createlesson")}
        style={{
          backgroundColor: "#007bff",
          paddingVertical: 14,
          paddingHorizontal: 30,
          borderRadius: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 3,
        }}
        activeOpacity={0.8}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Create Lesson</Text>
      </TouchableOpacity>
    </View>
  );
}
