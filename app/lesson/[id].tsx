import { useEffect, useState } from "react";
import { ScrollView, View, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getLessonById, updateLesson, deleteLesson } from "../../utils/lessonServices";
import { Feather } from "@expo/vector-icons";
import {
  Provider,
  Appbar,
  Menu,
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  useTheme,
} from "react-native-paper";
import { useAppTheme } from "@/hooks/themeContext"; // <- import your custom hook

export default function LessonScreen() {
  const { id } = useLocalSearchParams();
  const { theme } = useAppTheme(); // <- get your custom theme
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [updating, setUpdating] = useState(false);

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
    setUpdating(true);
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
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Provider>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
          <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
        </View>
      </Provider>
    );
  }

  if (!lesson) {
    return (
      <Provider>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
          <Text variant="titleMedium" style={{ color: theme.colors.accent }}>Lesson not found.</Text>
        </View>
      </Provider>
    );
  }

  return (
    <Provider>
      {/* App Bar */}
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => router.back()} color={theme.colors.onSurface} />
        <Appbar.Content title={editMode ? "Edit Lesson" : "Lesson"} titleStyle={{ color: theme.colors.onSurface, fontSize: 16, fontFamily: 'Inter-Medium',  }} />
        <Appbar.Action
          icon={editMode ? "close" : "pencil"}
          onPress={() => setEditMode((prev) => !prev)}
          color={theme.colors.onSurface}
        />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={<Appbar.Action icon="dots-vertical" onPress={() => setMenuVisible(true)} color={theme.colors.onSurface} />}
        >
          <Menu.Item onPress={handleStartQuiz} title="Start Quiz" />
          <Menu.Item onPress={handleViewQuestions} title="View Questions" />
          <Menu.Item onPress={handleDelete} title="Delete" titleStyle={{ color: theme.colors.accent }} />
        </Menu>
      </Appbar.Header>

      <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={{ padding: 16}}>
          {editMode ? (
            updating ? (
              <View style={{ paddingVertical: 40, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
                <Text style={{ marginTop: 8, color: theme.colors.onBackground,  fontSize: 16,
                fontFamily: 'Inter-Medium' }}>Saving...</Text>
              </View>
            ) : (
              <>
                <Text variant="titleMedium" style={{ marginBottom: 8, color: theme.colors.onBackground }}>Title</Text>
                <TextInput
                  value={updatedTitle}
                  onChangeText={setUpdatedTitle}
                  placeholder="Lesson Title"
                  mode="outlined"
                  style={{ marginBottom: 16,  fontSize: 16, fontFamily: 'Inter-Regular'}}
                  outlineColor={theme.colors.outline}
                  activeOutlineColor={theme.colors.primary}
                  textColor={theme.colors.onBackground}
                />

                <Text variant="titleMedium" style={{ marginBottom: 8, color: theme.colors.onBackground }}>Content</Text>
                <TextInput
                  value={updatedContent}
                  onChangeText={setUpdatedContent}
                  placeholder="Lesson Content"
                  multiline
                  mode="outlined"
                  style={{ marginBottom: 16, minHeight: 120 }}
                  outlineColor={theme.colors.outline}
                  activeOutlineColor={theme.colors.primary}
                  textColor={theme.colors.onBackground}
                />

                <Button
                  mode="contained"
                  onPress={handleUpdate}
                  disabled={updating}
                  style={{ marginTop: 8, borderRadius: theme.roundness }}
                  buttonColor={theme.colors.primary}
                  textColor={theme.colors.onPrimary}
                >
                  Save Changes
                </Button>
              </>
            )
          ) : (
            <>
              <View style={{ width: '100%' }}>
                <Text 
                  variant="headlineSmall" 
                  style={{
                    marginBottom: 8,
                    color: theme.colors.onBackground,
                    fontSize: 16,
                    fontFamily: 'Inter-Medium',
                    textAlign: 'justify',
                  }}
                >
                  {lesson.title}
                </Text>

                <Text 
                  variant="bodyMedium" 
                  style={{
                    color: theme.colors.onBackground,
                    fontSize: 14,
                    fontFamily: 'Inter-Regular',
                    textAlign: 'justify', 
                  }}
                >
                  {lesson.content}
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </Provider>
  );
}
