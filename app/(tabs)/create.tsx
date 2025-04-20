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
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Lesson</Text>
        <TouchableOpacity onPress={handleCreateLesson} disabled={loading}>
          <Ionicons name="checkmark" size={28} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={[styles.input, error && styles.inputError]}
              placeholder="Lesson title..."
              placeholderTextColor="#6b7280"
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
                dropdownIconColor="#a3a3a3"
              >
                <Picker.Item label="Select category" value="" enabled={false} />
                <Picker.Item label="Default" value="Default" />
                {categories.map((cat) => (
                  <Picker.Item key={cat._id} label={cat.name} value={cat.name} />
                ))}
                <Picker.Item label="Add new category..." value="add-category" color="#22d3ee" />
              </Picker>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Content</Text>
            <TextInput
              style={[styles.textArea, error && styles.inputError]}
              placeholder="Write your lesson content here..."
              placeholderTextColor="#6b7280"
              multiline
              numberOfLines={10}
              value={content}
              onChangeText={(text) => {
                setContent(text);
                setError("");
              }}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
    backgroundColor: "#1c1c1e", // slate-900
  },
  scrollContainer: {
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 10,
  },
  headerText: {
    color: "#f1f5f9", // slate-100
    fontSize: 22,
    fontWeight: "700",
  },
  card: {
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: "#e2e8f0", // slate-200
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#2b2b2b", // slate-700
    color: "#f8fafc", // slate-50
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  textArea: {
    backgroundColor: "#2b2b2b",
    color: "#f8fafc",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 160,
  },
  pickerContainer: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#2b2b2b",
  },
  picker: {
    color: "#f8fafc",
  },
  errorText: {
    color: "#f87171",
    fontSize: 14,
    marginTop: -10,
    marginBottom: 4,
  },
});
