import React, { useState, useEffect, useMemo } from "react";
import { SafeAreaView, ScrollView, Alert } from "react-native";
import { Text, TextInput, Button, HelperText } from "react-native-paper";
import { useRouter } from "expo-router";
import * as lessonService from "@/utils/createLessonServices";
import { useAppTheme } from "@/hooks/themeContext"; 
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
        <Text style={{ marginBottom: 8, fontFamily: 'Inter-Regular', color: theme.colors.onBackground }}>
            Notebook
          </Text>
          <Button
            mode="outlined"
            style={{ marginBottom: 20 }}
            theme={{ roundness: 1}}
            onPress={() => setModalVisible(true)} 
            icon="folder-plus"
            buttonColor={theme.colors.surface}
          >
            {categoryName || "Select Category"}
        </Button>

        <TextInput
          label="Title"
          mode="outlined"
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            setError("");
          }}
          placeholder="Lesson title..."
          style={{ fontFamily: 'Inter-Regular' }}
          theme={{  roundness: 6, colors: { primary: theme.colors.primary, error: theme.colors.accent } }}
          onBlur={() => setTouched((prev) => ({ ...prev, title: true }))} 
        />

        <HelperText type="error" visible={hasTitleError} style= {{fontFamily: 'Inter-Regular'}}>
          Title is required.
        </HelperText>

  

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
          style={{flex: 1, fontFamily: 'Inter-Regular' }}
          theme={{ roundness: 6, colors: { primary: theme.colors.primary, error: theme.colors.accent } }}
          onBlur={() => setTouched((prev) => ({ ...prev, content: true }))} 
        />
        <HelperText type="error" visible={hasContentError} style= {{fontFamily: 'Inter-Regular'}}>
          Content is required.
        </HelperText>
      </ScrollView>
        
      {/* Category Modal */}
      <CategoryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={() => {
          setCategoryName(newCategory); 
          setModalVisible(false); 
        }}
        value={newCategory}
        onChangeText={setNewCategory}
        categories={categories} 
        onCategorySelect={(selectedCategory: any) => {
          setCategoryName(selectedCategory); 
          setModalVisible(false); 
        }}
      />
    </SafeAreaView>
  );
}
