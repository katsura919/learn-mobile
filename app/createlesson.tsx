import { View, Text, TextInput, TouchableOpacity, Alert, Modal } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import * as lessonService from "../utils/createLessonServices";

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

      {/* Category Picker */}
      <Picker
        selectedValue={categoryName}
        onValueChange={(itemValue:any) => {
          if (itemValue === "add-category") {
            setModalVisible(true);
          } else {
            setCategoryName(itemValue);
          }
        }}
        style={{
          width: "100%",
          height: 50,
          backgroundColor: "#fff",
          borderWidth: 1,
          borderColor: "#ced4da",
          borderRadius: 10,
          marginBottom: 10,
        }}
      >
        <Picker.Item label="Default" value="Default" />
        {categories.map((cat) => (
          <Picker.Item key={cat._id} label={cat.name} value={cat.name} />
        ))}
        <Picker.Item label="➕ Add Category" value="add-category" />
      </Picker>

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

      {/* Modal for Adding Category */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 12, width: "90%" }}>
            <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: "600" }}>Create New Category</Text>
            <TextInput
              placeholder="Category Name"
              value={newCategory}
              onChangeText={setNewCategory}
              style={{
                borderWidth: 1,
                borderColor: "#ced4da",
                borderRadius: 10,
                paddingHorizontal: 15,
                backgroundColor: "#fff",
                fontSize: 16,
                marginBottom: 10,
              }}
            />
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginRight: 10 }}>
                <Text style={{ color: "#6c757d" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddCategory}>
                <Text style={{ color: "#007bff", fontWeight: "600" }}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
