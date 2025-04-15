import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getLessonById, updateLesson, deleteLesson } from "../../utils/lessonServices";

export default function LessonScreen() {
  const { id } = useLocalSearchParams();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");

  useEffect(() => {
    if (id) fetchLesson();
  }, [id]);

  const fetchLesson = async () => {
    try {
      const data = await getLessonById(id as string);
      setLesson(data);
      setUpdatedTitle(data.title);
      setUpdatedContent(data.content);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to fetch lesson.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    router.push(`/quiz/${id}`);
  };

  const handleUpdate = async () => {
    try {
      await updateLesson(id as string, {
        title: updatedTitle,
        content: updatedContent,
      });
      Alert.alert("Success", "Lesson updated successfully");
      setEditMode(false);
      fetchLesson();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update lesson.");
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Lesson", "Are you sure you want to delete this lesson?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteLesson(id as string);
            Alert.alert("Deleted", "Lesson deleted successfully");
            router.replace("/(tabs)/lessons");
          } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to delete lesson.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
        <Text style={{ fontSize: 16, color: "#dc3545" }}>Lesson not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <View style={{ marginBottom: 24 }}>
        {editMode ? (
          <>
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 4 }}>Title</Text>
            <TextInput
              value={updatedTitle}
              onChangeText={setUpdatedTitle}
              placeholder="Lesson Title"
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 12,
                borderRadius: 8,
                marginBottom: 16,
              }}
            />
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 4 }}>Content</Text>
            <TextInput
              value={updatedContent}
              onChangeText={setUpdatedContent}
              placeholder="Lesson Content"
              multiline
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 12,
                borderRadius: 8,
                minHeight: 120,
                textAlignVertical: "top",
              }}
            />
            <TouchableOpacity
              onPress={handleUpdate}
              style={{
                backgroundColor: "#28a745",
                padding: 14,
                borderRadius: 8,
                alignItems: "center",
                marginTop: 16,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Save Changes</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>{lesson.title}</Text>
            <Text style={{ fontSize: 16, lineHeight: 24 }}>{lesson.content}</Text>
          </>
        )}
      </View>

      {/* Action Buttons */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
        <TouchableOpacity
          onPress={() => setEditMode((prev) => !prev)}
          style={{
            backgroundColor: "#007bff",
            padding: 12,
            borderRadius: 8,
            flex: 1,
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            {editMode ? "Cancel Edit" : "Edit Lesson"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleStartQuiz}
          style={{
            backgroundColor: "#6200ee",
            padding: 12,
            borderRadius: 8,
            flex: 1,
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Start Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDelete}
          style={{
            backgroundColor: "#dc3545",
            padding: 12,
            borderRadius: 8,
            flex: 1,
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

