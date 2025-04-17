// home.tsx
import { View, Text, TouchableOpacity, FlatList, Image, StatusBar, ActivityIndicator, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";
import { fetchHomeStats, fetchLatestLessons } from "../../utils/homeServices";
import SearchBar from "../../components/home-searchbar";
import { Feather } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const [stats, setStats] = useState({ totalLessons: 0, totalAttempts: 0, averageScore: 0 });
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [isGrid, setIsGrid] = useState(false);
  const [sortOrderAsc, setSortOrderAsc] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUserData = await SecureStore.getItemAsync("userData");
        if (!storedUserData) throw new Error("No userData found");

        const parsedUser = JSON.parse(storedUserData);
        setUserId(parsedUser.id);

        const statsData = await fetchHomeStats(parsedUser.id);
        setStats(statsData);

        const lessonData = await fetchLatestLessons(parsedUser.id);
        setLessons(lessonData);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredLessons = lessons
    .filter(lesson =>
      lesson.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrderAsc ? dateA - dateB : dateB - dateA;
    });

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1c1c1e" }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

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

     {/* Lessons */}
      <FlatList
        data={filteredLessons}
        key={isGrid ? "g" : "l"}
        numColumns={isGrid ? 2 : 1}
        columnWrapperStyle={isGrid ? { justifyContent: "space-between" } : undefined}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => router.push(`/lesson/${item._id}`)}
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

            {/* Lesson Content Preview */}
            <Text
              style={{ color: "#444", fontSize: 13, marginBottom: 6 }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.content}
            </Text>

            <Text style={{ color: "#333", fontSize: 12 }}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
