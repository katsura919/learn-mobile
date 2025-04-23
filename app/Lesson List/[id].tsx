import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Dimensions, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { fetchLessonsByCategory } from "../../utils/lessonServices";
import SearchBar from "../../components/home-searchbar";
import { Feather, Entypo } from '@expo/vector-icons';
import { Menu, Provider } from 'react-native-paper';
import { deleteCategory, updateCategory } from "@/utils/categoryService";
import LessonListHeader from '../../components/lesson-list-header';
const screenWidth = Dimensions.get('window').width;

export default function LessonList() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();

  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isGrid, setIsGrid] = useState(false);
  const [sortOrderAsc, setSortOrderAsc] = useState(false);
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  useFocusEffect(
    useCallback(() => {
      const loadLessons = async () => {
        try {
          setLoading(true);
          const lessonData = await fetchLessonsByCategory(id as string);
          setLessons(lessonData);
        } catch (error) {
          console.error("Error:", error);
          setLessons([]);
        } finally {
          setLoading(false);
        }
      };
  
      loadLessons();
    }, [id]) 
  );
  const handleRename = async (newName: string) => {
    try {
      const updated = await updateCategory(id as string, newName);
      Alert.alert("Success", `Category renamed to ${updated.name}`);
    } catch (err: any) {
      Alert.alert("Rename Failed", err.error || "Something went wrong.");
    }
  };

  const handleDelete = async () => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this category?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCategory(id as string);
            Alert.alert("Deleted", "Category deleted successfully.");
            router.back(); // 👈 useRouter for going back
          } catch (err: any) {
            Alert.alert("Delete Failed", err.error || "Something went wrong.");
          }
        },
      },
    ]);
  };



  // Safely filter lessons - ensure lessons is always an array
  const filteredLessons = Array.isArray(lessons) 
    ? lessons
        .filter(lesson => 
          lesson?.title?.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
          const dateA = new Date(a?.createdAt || 0).getTime();
          const dateB = new Date(b?.createdAt || 0).getTime();
          return sortOrderAsc ? dateA - dateB : dateB - dateA;
        })
    : [];

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1c1c1e" }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  
  return (
    <Provider>
      <View style={{flex: 1, backgroundColor: "#ffffff", paddingHorizontal: 16 }}>
      

      {/* Header */}
      <View style={{flexDirection: "column", height: 130 }}>
        {/* LessonListHeader */}
        <LessonListHeader
          name={name as string}
          visible={visible}
          openMenu={openMenu}
          closeMenu={closeMenu}
          onRename={handleRename}
          onDelete={handleDelete}
        />

        {/* Search Bar */}
        <SearchBar value={search} onChangeText={setSearch} />
     </View>
     

      {/* View + Sort Toggle */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => setIsGrid(!isGrid)}
          style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
        >
          <Feather name={isGrid ? "list" : "grid"} size={18} color="#333" />
          <Text style={{ color: "#333", fontSize: 13 }}>{isGrid ? "List view" : "Grid view"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSortOrderAsc(!sortOrderAsc)}
          style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
        >
          <Feather name={sortOrderAsc ? "arrow-up" : "arrow-down"} size={18} color="#333" />
          <Text style={{ color: "#333", fontSize: 13 }}>
            {sortOrderAsc ? "Oldest first" : "Newest first"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lessons List */}
      {filteredLessons.length > 0 ? (
        <FlatList
          data={filteredLessons}
          key={isGrid ? "g" : "l"}
          numColumns={isGrid ? 2 : 1}
          columnWrapperStyle={isGrid ? { justifyContent: "space-between" } : undefined}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => router.push(`/Lesson/${item._id}`)}
              style={{
                backgroundColor: ["#fef3c7", "#e0f2fe", "#f0fdfa", "#fae8ff", "#fef2f2"][index % 5],
                padding: 16,
                borderRadius: 20,
                marginBottom: 16,
                elevation: 2,
                width: isGrid ? (screenWidth - 60) / 2 : "100%"
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 6, color: "#111" }}>
                {item.title}
              </Text>
              <Text style={{ color: "#555", fontSize: 13, marginBottom: 6 }} numberOfLines={4} ellipsizeMode="tail">
                {item.content}
              </Text>
              <Text style={{ color: "#777", fontSize: 12 }}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#666" }}>No lessons found</Text>
        </View>
      )}
      </View>
    </Provider>
  );
}