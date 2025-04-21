import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Dimensions, StatusBar } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { fetchLessonsByCategory } from "../../utils/lessonServices";
import SearchBar from "../../components/home-searchbar";
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function LessonList() {
  const { id } = useLocalSearchParams();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [isGrid, setIsGrid] = useState(false);
  const [sortOrderAsc, setSortOrderAsc] = useState(false);
  console.log(lessons)

useEffect(() => {
  const loadLessons = async () => {
    try {
      setLoading(true);
      const lessonData = await fetchLessonsByCategory(id as string);
      setLessons(lessonData); // We're now guaranteed this is an array
    } catch (error) {
      console.error("Error:", error);
      setLessons([]); // Fallback empty array
    } finally {
      setLoading(false);
    }
  };

  loadLessons();
}, [id]);
  
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
  const handleBackPress = () => {
    router.back(); // Or use router.push('/') to go to a specific route
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: "#1c1c1e", padding: 20 }}>
      <StatusBar barStyle="light-content" backgroundColor="black" />

      {/* SearchBar */}
      <SearchBar value={search} onChangeText={setSearch} />

      {/* View + Sort Toggle */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => setIsGrid(!isGrid)}
          style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
        >
          <Feather name={isGrid ? "list" : "grid"} size={18} color="#ccc" />
          <Text style={{ color: "#ccc", fontSize: 13 }}>{isGrid ? "List view" : "Grid view"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSortOrderAsc(!sortOrderAsc)}
          style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
        >
          <Feather name={sortOrderAsc ? "arrow-up" : "arrow-down"} size={18} color="#ccc" />
          <Text style={{ color: "#ccc", fontSize: 13 }}>
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
                width: isGrid ? (screenWidth - 60) / 2 : "100%"
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 6, color: "#111" }}>
                {item.title}
              </Text>
              <Text style={{ color: "#444", fontSize: 13, marginBottom: 6 }} numberOfLines={2} ellipsizeMode="tail">
                {item.content}
              </Text>
              <Text style={{ color: "#333", fontSize: 12 }}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#ccc" }}>No lessons found</Text>
        </View>
      )}
    </View>
  );
}