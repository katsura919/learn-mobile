import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import * as lessonService from "../../utils/createLessonServices";
import CategoryModal from "../../components/create-category-modal";

export default function CreateLessonScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryName, setCategoryName] = useState("Default");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await lessonService.fetchCategories();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  async function handleCreateLesson() {
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

  async function handleAddCategory() {
    if (!newCategory.trim()) return;

    try {
      const created = await lessonService.createCategory(newCategory);
      setCategories((prev) => [...prev, created]);
      setCategoryName(created.name);
      setNewCategory("");
      setModalVisible(false);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to create category.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.notebookRing} />
          <Text style={styles.title}>New Lesson</Text>
          <Text style={styles.subtitle}>Fill your notebook page</Text>
        </View>

        <View style={styles.notebookPage}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="Lesson title..."
              placeholderTextColor="#9ca3af"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setError("");
              }}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={categoryName}
                onValueChange={(itemValue) => {
                  if (itemValue === "add-category") {
                    setModalVisible(true);
                  } else {
                    setCategoryName(itemValue);
                  }
                }}
                style={styles.picker}
                dropdownIconColor="#6b7280"
              >
                <Picker.Item label="Select category" value="" enabled={false} />
                <Picker.Item label="Default" value="Default" />
                {categories.map((cat) => (
                  <Picker.Item key={cat._id} label={cat.name} value={cat.name} />
                ))}
                <Picker.Item 
                  label="Add new category..." 
                  value="add-category" 
                  color="#4f46e5" 
                />
              </Picker>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Content</Text>
            <TextInput
              style={[styles.textArea, error && styles.inputError]}
              placeholder="Write your lesson content here..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={8}
              value={content}
              onChangeText={(text) => {
                setContent(text);
                setError("");
              }}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCreateLesson}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Ionicons name="bookmark-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>
              {loading ? "Saving..." : "Save Lesson"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CategoryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddCategory}
        value={newCategory}
        onChangeText={setNewCategory}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    paddingLeft: 16,
    position: "relative",
  },
  notebookRing: {
    position: "absolute",
    left: 0,
    top: 4,
    height: "80%",
    width: 12,
    backgroundColor: "#e5e7eb",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  notebookPage: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#f9fafb",
    color: "#111827",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  textArea: {
    backgroundColor: "#f9fafb",
    color: "#111827",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 160,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    backgroundColor: "#f9fafb",
    color: "#111827",
  },
  button: {
    backgroundColor: "#4f46e5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    gap: 10,
    shadowColor: "#4f46e5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "#a5b4fc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
  },
});