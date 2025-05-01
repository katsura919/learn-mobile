import React, { useState, useRef } from 'react';
import { View, StatusBar, TouchableOpacity, FlatList, Dimensions, Animated } from 'react-native';
import { TextInput, Appbar, Avatar, Card, Text, FAB, ActivityIndicator } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { getCategories } from '../../utils/homeServices';
import { router, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/themeContext'; 


const { width } = Dimensions.get('window');
const CARD_PADDING = 16;
const SPACING = 12;
const GRID_COLUMNS = 2;

const Home = () => {
  const { theme, isDark, toggleTheme } = useAppTheme(); 
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<any>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [isGridView, setIsGridView] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [isExtended, setIsExtended] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // <-- Add loading stat
  const searchAnim = useRef(new Animated.Value(width - 32)).current;
  
  const toggleSearch = () => {
    Animated.timing(searchAnim, {
      toValue: searchTerm ? width - 32 : width * 0.5,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const filteredSorted = [...categories]
    .filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) =>
      sortAsc
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  useFocusEffect(() => {
    const fetchCategories = async () => {
      try {
        const userData = await SecureStore.getItemAsync('userData');
        if (userData) setUser(JSON.parse(userData));

        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.log('Error fetching categories', err);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchCategories();
  });

  const renderItem = ({ item }: { item: any }) => (
    <Card
      onPress={() => router.push(`/Lesson List/${item._id}?name=${item.name}`)}
      style={{
        flex: 1,
        margin: SPACING / 2,
        borderRadius: 16,
        elevation: 3,
        backgroundColor: theme.colors.surface,
      }}
    >
      <Card.Content
        style={{
          flexDirection: isGridView ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: isGridView ? 'center' : 'flex-start',
          paddingVertical: 16,
          paddingHorizontal: 8,
        }}
      >
        <Avatar.Icon
          icon="folder-open"
          size={isGridView ? 56 : 48}
          style={{
            marginBottom: isGridView ? 10 : 0,
            marginRight: isGridView ? 0 : 12,
            backgroundColor: theme.colors.primary,
          }}
          color={theme.colors.onPrimary}
        />
        <Text
          variant="titleSmall"
          style={{
            textAlign: isGridView ? 'center' : 'left',
            fontFamily: 'Inter-Regular',
            color: theme.colors.onSurface,
          }}
        >
          {item.name}
        </Text>
      </Card.Content>
    </Card>
  );  

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.background} 
      />

      <Appbar.Header style={{ backgroundColor: theme.colors.background, elevation: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <Avatar.Image
            size={40}
            source={
              user?.profilePic
                ? { uri: user.profilePic }
                : require('@/assets/images/profile.png')
            }
            style={{ marginLeft: 12 }}
          />
        </TouchableOpacity>


          {user?.firstName && user?.lastName && (
            <Text
              style={{
                marginLeft: 12,
                fontSize: 16,
                fontFamily: 'Inter-Medium', 
                color: theme.colors.onBackground,
              }}
            >
              {user.firstName} {user.lastName}
            </Text>
          )}
        </View>

        <Appbar.Action
          icon={isDark ? 'white-balance-sunny' : 'weather-night'}
          onPress={toggleTheme}
        />
      </Appbar.Header>

      <View style={{ paddingHorizontal: CARD_PADDING }}>
        <Animated.View style={{ width: searchAnim }}>
          <TextInput
            mode="outlined"
            placeholder="Search notes..."
            value={searchTerm}
            onChangeText={(text) => {
              setSearchTerm(text);
              toggleSearch();
            }}
            left={<TextInput.Icon icon="magnify" size={20}/>}
            style={{ marginBottom: 16, height: 45 }}
            theme={{
              roundness: 6,
              colors: {
                primary: theme.colors.primary,
                background: theme.colors.surface,
              },
            }}
          />
        </Animated.View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => setIsGridView(!isGridView)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <MaterialIcons
              name={isGridView ? 'grid-view' : 'list'}
              size={15}
              color={theme.colors.onBackground}
            />
            <Text style={{ marginLeft: 6, fontFamily: 'Inter-Regular', fontSize: 12, color: theme.colors.onBackground }}>
              View: {isGridView ? 'Grid' : 'List'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSortAsc(!sortAsc)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text style={{ marginRight: 6, fontFamily: 'Inter-Regular', fontSize: 12, color: theme.colors.onBackground }}>
              Sort by Date
            </Text>
            <MaterialIcons
              name={sortAsc ? 'arrow-upward' : 'arrow-downward'}
              size={15}
              color={theme.colors.onBackground}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* If loading, show loader */}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: CARD_PADDING,
            paddingBottom: 100,
          }}
          data={filteredSorted}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          numColumns={isGridView ? GRID_COLUMNS : 1}
          key={isGridView ? 'grid' : 'list'} 
        />
      )}

      <FAB
        icon="plus"
        label="New Lesson"
        style={{
          position: 'absolute',
          height: 55,
          right: 16,
          bottom: 16,
          backgroundColor: theme.colors.primary,
          borderRadius: 7
        }}
        color={theme.colors.onPrimary}
        onPress={() => router.push('/create')}
      />
    </View>
  );
};

export default Home;
