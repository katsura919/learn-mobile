import React, { useState, useEffect, useMemo } from "react";
import { SafeAreaView, ScrollView, Alert } from "react-native";
import { Text, TextInput, Button, HelperText } from "react-native-paper";
import { useRouter } from "expo-router";
import * as lessonService from "@/utils/createLessonServices";
import { useAppTheme } from "@/hooks/themeContext"; // Import useAppTheme
import AppHeader from "@/components/create/create-header";
import CategoryModal from "@/components/create/create-category-modal";


export default function CreateLessonScreen() {
  const router = useRouter();
  const { theme } = useAppTheme(); 
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryName, setCategoryName] = useState("Default");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [touched, setTouched] = useState({ title: false, content: false });

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await lessonService.fetchCategories();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  async function handleCreateLesson() {
    setTouched({ title: true, content: true });

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await lessonService.createLesson({ title, content, categoryName });
      Alert.alert("Success", "Lesson created successfully!", [
        { text: "OK", onPress: () => router.push("/(tabs)/home") },
      ]);
    } catch (err: any) {
      setError(err.message || "Failed to create lesson.");
    } finally {
      setLoading(false);
    }
  }

  const hasTitleError = touched.title && !title.trim();
  const hasContentError = touched.content && !content.trim();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <AppHeader
        title="Create Lesson"
        onSave={handleCreateLesson} // Pass the save function to the header
      />
      
      <ScrollView contentContainerStyle={{ padding: 20 }}>
      <TextInput
          label="Title"
          mode="outlined"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            setError("");
          }}
          placeholder="Lesson title..."
          style={{ marginBottom: 20, fontFamily: 'Inter-Regular' }}
          theme={{ colors: { primary: theme.colors.primary, error: theme.colors.accent } }}
          onBlur={() => setTouched((prev) => ({ ...prev, title: true }))} 
        />
        <HelperText type="error" visible={hasTitleError}>
          Title is required.
        </HelperText>

        <Text style={{ marginBottom: 8, fontFamily: 'Inter-Regular', color: theme.colors.onBackground }}>
          Category
        </Text>
        <Button
          mode="outlined"
          style={{ marginBottom: 20 }}
          onPress={() => setModalVisible(true)} // Open category modal
          icon="folder-plus"
          buttonColor={theme.colors.surface}
        >
          {categoryName || "Select Category"}
        </Button>

        <TextInput
          label="Content"
          mode="outlined"
          value={content}
          onChangeText={(text) => {
            setContent(text);
            setError("");
          }}
          placeholder="Write your lesson content here..."
          multiline
          numberOfLines={5}
          style={{ marginBottom: 20, fontFamily: 'Inter-Regular' }}
          theme={{ colors: { primary: theme.colors.primary, error: theme.colors.accent } }}
          onBlur={() => setTouched((prev) => ({ ...prev, content: true }))} 
        />
        <HelperText type="error" visible={hasContentError}>
          Content is required.
        </HelperText>
      </ScrollView>
        
      {/* Category Modal */}
      <CategoryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={() => {
          setCategoryName(newCategory); // Set the selected category
          setModalVisible(false); // Close the modal
        }}
        value={newCategory}
        onChangeText={setNewCategory}
        categories={categories} // Pass categories to the modal
        onCategorySelect={(selectedCategory: any) => {
          setCategoryName(selectedCategory); // Set the selected category
          setModalVisible(false); // Close the modal
        }}
      />
    </SafeAreaView>
  );
}
