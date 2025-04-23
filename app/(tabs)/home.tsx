import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
} from 'react-native';
import {useFonts} from 'expo-font';
import * as SecureStore from "expo-secure-store";
import { getCategories } from '../../utils/homeServices';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import CreateLessonBtn from '../../components/home-plus-btn'

const notebookIcons = [
  require('../../assets/icons/notebooks/notebook-green.png'),
  require('../../assets/icons/notebooks/notebook-red.png'),
  require('../../assets/icons/notebooks/notebook-blue.png'),
  require('../../assets/icons/notebooks/notebook-yellow.png'),
];

const Home = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<any>(null);
  const [sortAsc, setSortAsc] = useState(true); 
  const [isGridView, setIsGridView] = useState(true);

  const [fontsLoaded] = useFonts({
    'Poppins-Black': require('../../assets/fonts/Poppins-Black.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
    'Inter': require('../../assets/fonts/Inter.ttf'),
    'Inter-Regular': require('../../assets/fonts/Inter-Regular.ttf'),
    'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.ttf'),
  });

  const sortedFilteredCategories = [...categories]
    .filter(cat =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortAsc
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );


  useFocusEffect(() => {
    const fetchCategories = async () => {
      try {
        const userData = await SecureStore.getItemAsync("userData");
          if (userData) {
            const parsedUserData = JSON.parse(userData);
            setUser(parsedUserData);      
          }

        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.log('Failed to load categories');
      }
    };

    fetchCategories();
  });

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fefeff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 5,
          paddingBottom: 80, // Increased paddingBottom for better scroll behavior
        }}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginBottom: 10, marginTop: 10}}>
          <Text style={{ fontSize: 26, fontFamily: "Inter-Bold", color: '#222' }}>Notebooks</Text>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Image
              source={{ uri: user?.profilePic }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 25,
              }}
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          paddingHorizontal: 12,
          paddingVertical: 1,
          borderRadius: 12,
          marginBottom: 20,
          marginTop: 10,
          elevation: 2,
        }}>
          <Ionicons name="search-outline" size={20} color="#999" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search notes..."
            placeholderTextColor="#999"
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={{ flex: 1, fontSize: 14, color: '#333', fontFamily: "Inter-Regular" }}
          />
        </View>

     
        {/* View + Sort Controls */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          {/* View Toggle (Left) */}
          <TouchableOpacity
            onPress={() => setIsGridView(!isGridView)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <MaterialIcons
              name={isGridView ? 'grid-view' : 'list'}
              size={20}
              color="#444"
            />
            <Text style={{ marginLeft: 4, fontSize: 12, color: '#444', fontFamily: "Inter-Regular" }}>
              {isGridView ? 'Grid' : 'List'}
            </Text>
          </TouchableOpacity>

          {/* Sort By Date (Right) */}
          <TouchableOpacity
            onPress={() => setSortAsc(!sortAsc)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text style={{ marginRight: 4, fontSize: 12, color: '#444', fontFamily: "Inter-Regular" }}>
              Sort by Date
            </Text>
            <MaterialIcons
              name={sortAsc ? 'arrow-upward' : 'arrow-downward'}
              size={20}
              color="#444"
            />
          </TouchableOpacity>
        </View>


        {/* Categories */}
        <View
          style={{
            flexDirection: isGridView ? 'row' : 'column',
            flexWrap: isGridView ? 'wrap' : 'nowrap',
            justifyContent: isGridView ? 'space-between' : 'flex-start',
            marginTop: 10,
          }}
        >
          {sortedFilteredCategories.map((cat, index) => (
            <TouchableOpacity
              key={cat._id}
              onPress={() => router.push(`/Lesson List/${cat._id}?name=${cat.name}`)}
              style={{
                width: isGridView ? '47%' : '100%',
                flexDirection: isGridView ? 'column' : 'row',
                alignItems: 'center',
                marginBottom: 20,
                padding: isGridView ? 0 : 10,
                backgroundColor: isGridView ? 'transparent' : '#f4f4f4',
                borderRadius: 10,
              }}
            >
              <Image
                source={notebookIcons[index % notebookIcons.length]}
                style={{
                  width: isGridView ? 120 : 60,
                  height: isGridView ? 120 : 60,
                  marginRight: isGridView ? 0 : 12,
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 13,
                  color: '#1e1e1e',
                  textAlign: isGridView ? 'center' : 'left',
                  fontFamily: "Inter-Regular",
                }}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* Floating Button for Creating Lesson */}
      <CreateLessonBtn />
    </View>
  );
};

export default Home;
