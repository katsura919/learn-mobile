import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getLessonById, updateLesson, deleteLesson } from "../../utils/lessonServices";
import { Feather } from "@expo/vector-icons";
import { Menu, Provider } from "react-native-paper";

export default function LessonScreen() {
  const { id } = useLocalSearchParams();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);

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
    router.push(`/Quiz/${id}`);
    setMenuVisible(false);
  };

  const handleViewQuestions = () => {
    router.push(`/Question/${id}`);
    setMenuVisible(false);
  };

  const handleDelete = () => {
    setMenuVisible(false);
    Alert.alert("Delete Lesson", "Are you sure you want to delete this lesson?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteLesson(id as string);
            Alert.alert("Deleted", "Lesson deleted successfully");
            router.replace("/Lesson/[id]");
          } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to delete lesson.");
          }
        },
      },
    ]);
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
    <Provider>
      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Custom Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            backgroundColor: "#fff",
          }}
        >
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>

          {/* Spacer to center title if you want */}
          <View style={{ flex: 1 }} />

          {/* Right-side icons */}
          <View style={{ flexDirection: "row", gap: 16 }}>
            <TouchableOpacity onPress={() => setEditMode((prev) => !prev)}>
              <Feather name={editMode ? "x" : "edit"} size={22} color="#333" />
            </TouchableOpacity>

            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                  <Feather name="more-vertical" size={22} color="#333" />
                </TouchableOpacity>
              }
            >
              <Menu.Item onPress={handleStartQuiz} title="Start Quiz" />
              <Menu.Item onPress={handleViewQuestions} title="View Questions" />
              <Menu.Item onPress={handleDelete} title="Delete" titleStyle={{ color: "#dc3545" }} />
            </Menu>
          </View>
        </View>


        {/* Lesson Content */}
        <View style={{ padding: 16 }}>
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
      </ScrollView>
    </Provider>
  );
}
