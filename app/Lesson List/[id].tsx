import { View, FlatList, Dimensions, Alert, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { fetchLessonsByCategory } from "../../utils/lessonServices";
import SearchBar from "../../components/Lesson List/lesson-list-searchbar";
import { IconButton, Card, Text, ActivityIndicator } from "react-native-paper";
import { deleteCategory, updateCategory } from "@/utils/categoryService";
import LessonListHeader from "../../components/Lesson List/lesson-list-header";
import { useAppTheme } from "@/hooks/themeContext";
import { MaterialIcons } from '@expo/vector-icons';
import socket, { connectSocket } from "@/utils/socket";
const screenWidth = Dimensions.get("window").width;

export default function LessonList() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  const { theme, isDark, toggleTheme } = useAppTheme(); 
  const { colors } = theme;

  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isGrid, setIsGrid] = useState(false);
  const [sortOrderAsc, setSortOrderAsc] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);




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
    Alert.alert("Delete Category", "Are you sure you want to delete this category?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCategory(id as string);
            Alert.alert("Deleted", "Category deleted successfully.");
            router.back();
          } catch (err: any) {
            Alert.alert("Delete Failed", err.error || "Something went wrong.");
          }
        },
      },
    ]);
  };

  const filteredLessons = Array.isArray(lessons)
    ? lessons
        .filter((lesson) =>
          lesson?.title?.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
          const dateA = new Date(a?.createdAt || 0).getTime();
          const dateB = new Date(b?.createdAt || 0).getTime();
          return sortOrderAsc ? dateA - dateB : dateB - dateA;
        })
    : [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.background} 
      />
      
      <LessonListHeader
        name={name as string}
        onRename={handleRename}
        onDelete={handleDelete}
        visible={menuVisible}
        openMenu={openMenu}
        closeMenu={closeMenu}
      />
    
      <SearchBar value={search} onChangeText={setSearch} />
    
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 12,
          alignItems: 'center',
          paddingHorizontal: 10, 
          marginLeft: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => setIsGrid(!isGrid)}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <MaterialIcons
            name={isGrid ? 'grid-view' : 'list'}
            size={15}
            color={theme.colors.onBackground}
          />
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              fontSize: 12,
              color: theme.colors.onBackground,
            }}
          >
            {isGrid ? ' List view' : ' Grid view'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSortOrderAsc(!sortOrderAsc)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 20,
          }}
        >
          <MaterialIcons
            name={sortOrderAsc ? 'arrow-upward' : 'arrow-downward'}
            size={15}
            color={theme.colors.onBackground}
          />
          <Text
            style={{
              fontFamily: 'Inter-Regular',
              fontSize: 12,
              color: theme.colors.onBackground,
            }}
          >
            {sortOrderAsc ? ' Oldest' : ' Newest'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 16 }}>
        <View style={{ flex: 1 }}>
          {filteredLessons.length > 0 ? (
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
              <View
                style={{
                  flexDirection: isGrid ? "row" : "column",
                  flexWrap: "wrap",
                  justifyContent: isGrid ? "space-between" : "flex-start",
                  paddingHorizontal: 2,
                  paddingBottom: 80,
                }}
              >
                {filteredLessons.map((item, index) => (
                  <Card
                    key={item._id}
                    mode="elevated"
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: 10,
                      marginBottom: 16,
                      paddingHorizontal: 4,
                      paddingVertical: 2,
                      width: isGrid ? (screenWidth - 48) / 2 : "100%", // adjust width in grid
                      marginRight: isGrid && index % 2 === 0 ? 12 : 0, // add right margin to first column
                      elevation: 1,
                    }}
                    onPress={() => router.push(`/Lesson/${item._id}`)}
                  >
                    <Card.Content>
                      <Text
                        variant="titleMedium"
                        style={{
                          color: colors.onSurface,
                          marginBottom: 6,
                          fontWeight: "600",
                        }}
                      >
                        {item.title}
                      </Text>

                      <Text
                        variant="bodySmall"
                        style={{ color: colors.onSurface }}
                        numberOfLines={4}
                      >
                        {item.content}
                      </Text>

                      <Text
                        style={{
                          marginTop: 12,
                          fontSize: 12,
                          color: colors.outline,
                        }}
                      >
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </Card.Content>
                  </Card>
                ))}
              </View>

            </ScrollView>
          ) : loading ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ color: colors.onBackground }}>No lessons found.</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
