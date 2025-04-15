import { View, Text, TouchableOpacity, FlatList, Image, StatusBar, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import { fetchHomeStats, fetchLatestLessons } from "../../utils/homeServices"; // adjust the path if needed

export default function HomeScreen() {
  const [stats, setStats] = useState({ totalLessons: 0, totalAttempts: 0, averageScore: 0 });
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUserData = await SecureStore.getItemAsync("userData");
        if (!storedUserData) throw new Error("No userData found in SecureStore.");
  
        const parsedUser = JSON.parse(storedUserData);
        setUserId(parsedUser.id);
  
        const statsData = await fetchHomeStats(parsedUser.id);
        setStats(statsData);

        const lessonData = await fetchLatestLessons(parsedUser.id);
        setLessons(lessonData);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    loadData();
  }, []);
  

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5', padding: 16 }}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#333' }}>Lesson Learn</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
          <Image 
            source={{ uri: 'https://res.cloudinary.com/drpxke63n/image/upload/v1744105352/profile_pics/v32stffmr1p6hb95acj0.png' }} 
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={{
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1
      }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>Your Learning Stats</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#6200ee' }}>{stats.totalLessons}</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>Lessons</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#03dac6' }}>{stats.totalAttempts}</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>Quizzes Taken</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ffc107' }}>{stats.averageScore}%</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>Avg. Score</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 24 }}>
        <TouchableOpacity 
          onPress={() => router.push('/createlesson')}
          style={{
            backgroundColor: '#6200ee',
            padding: 16,
            borderRadius: 12,
            flex: 1,
            marginRight: 8,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Create New Lesson</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => router.push('/(tabs)/lessons')}
          style={{
            backgroundColor: '#03dac6',
            padding: 16,
            borderRadius: 12,
            flex: 1,
            marginLeft: 8,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Take a Quiz</Text>
        </TouchableOpacity>
      </View>

      {/* Lessons */}
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: '#333' }}>Continue Learning</Text>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/lesson/${item._id}`)}
            style={{
              backgroundColor: 'white',
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 6 }}>
              {item.title}
            </Text>
            <Text style={{ color: '#888', fontSize: 13 }}>
              Last updated: {new Date(item.updatedAt).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />

    </View>
  );
}
