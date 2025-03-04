import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

export default function CreateLessonScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log(process.env.EXPO_PUBLIC_API_URL)
  
  async function handleCreateLesson() {
    if (title.trim() === "" || content.trim() === "") {
      setError("Title and content are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        setError("Unauthorized. Please log in again.");
        return;
      }

      const response = await axios.post(
       `http://10.0.2.2:5000/api/lessons`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Lesson created successfully!", [
        { text: "OK", onPress: () => router.push("/(tabs)/home") },
      ]);
    } catch (err:any) {
      setError(err.response?.data?.error || "Failed to create lesson.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: "#f8f9fa" }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 10 }}>📖 Create Lesson</Text>
      <Text style={{ fontSize: 16, color: "#6c757d", marginBottom: 20 }}>Enter lesson details below:</Text>

      <TextInput
        placeholder="Lesson Title"
        style={{
          width: "100%",
          height: 50,
          borderWidth: 1,
          borderColor: error ? "#dc3545" : "#ced4da",
          borderRadius: 10,
          paddingHorizontal: 15,
          backgroundColor: "#fff",
          fontSize: 16,
          marginBottom: 10,
        }}
        onChangeText={(text) => {
          setTitle(text);
          setError("");
        }}
      />

      <TextInput
        placeholder="Lesson Content"
        multiline
        numberOfLines={6}
        style={{
          width: "100%",
          height: 120,
          borderWidth: 1,
          borderColor: error ? "#dc3545" : "#ced4da",
          borderRadius: 10,
          paddingHorizontal: 15,
          paddingVertical: 10,
          backgroundColor: "#fff",
          fontSize: 16,
          textAlignVertical: "top",
        }}
        onChangeText={(text) => {
          setContent(text);
          setError("");
        }}
      />

      {error ? <Text style={{ color: "#dc3545", marginBottom: 10 }}>{error}</Text> : null}

      <TouchableOpacity
        onPress={handleCreateLesson}
        style={{
          backgroundColor: loading ? "#6c757d" : "#007bff",
          paddingVertical: 14,
          borderRadius: 10,
          width: "100%",
          alignItems: "center",
          marginTop: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 3,
        }}
        activeOpacity={0.8}
        disabled={loading}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
          {loading ? "Saving..." : "Save Lesson"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
