import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getUserLessons } from "../../utils/lessonServices";

export default function LessonsScreen() {
  const router = useRouter();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLessons = async () => {
      const data = await getUserLessons();
      setLessons(data);
      setLoading(false);
    };

    loadLessons();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f8f9fa" }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>📚 My Lessons</Text>

      <TouchableOpacity
        onPress={() => router.push("/createlesson")}
        style={{
          backgroundColor: "#007bff",
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 10,
          alignSelf: "flex-end",
          marginBottom: 16,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>+ Create Lesson</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : lessons.length === 0 ? (
        <Text style={{ fontSize: 16, color: "#6c757d", textAlign: "center", marginTop: 20 }}>
          You don't have any lessons yet.
        </Text>
      ) : (
        <FlatList
          data={lessons}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/lesson/${item._id}`)}
              style={{
                backgroundColor: "#fff",
                padding: 16,
                borderRadius: 12,
                marginBottom: 12,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>{item.title}</Text>
              <Text style={{ color: "#6c757d", fontSize: 14 }}>
                Last updated: {new Date(item.updatedAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
