// screens/home.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar} from 'react-native';
import { getCategories } from '../../utils/homeServices';
import { router } from 'expo-router';

const notebookIcon = require('../../assets/icons/notebook.png');

const Home = () => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.log('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 40,
        flexGrow: 1,
        backgroundColor: '#f9fafc', // Soft white/gray background
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1e1e1e" />

      {/* Header */}
      {/* Greeting */}
      <View style={{ marginBottom: 10 }}>
        <Text style={{ fontSize: 26, fontWeight: '700', color: '#111' }}>
          Good morning , Jack
        </Text>
        <Text style={{ fontSize: 14, color: '#777', marginTop: 4 }}>
          Sunday, 2 June
        </Text>
      </View>

      {/* Section Title */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 28,
          marginBottom: 16,
        }}
      >
        <View
          style={{
            width: 4,
            height: 20,
            backgroundColor: '#ff9800',
            marginRight: 10,
            borderRadius: 2,
          }}
        />
        <Text style={{ fontSize: 20, fontWeight: '600', color: '#222' }}>
          My Notebooks
        </Text>
      </View>

      {/* Categories Grid */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat._id}
            onPress={() => router.push(`/Lesson List/${cat._id}`)}
            style={{
              width: '47%',
              paddingVertical: 20,
              paddingHorizontal: 10,
            }}
          >
            <Image
              source={notebookIcon}
              style={{
                width: 110,
                height: 110,
                resizeMode: 'contain',
                marginBottom: 16,
              }}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#333',
                marginBottom: 4,
              }}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default Home;
