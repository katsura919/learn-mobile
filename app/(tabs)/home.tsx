import React, { useEffect, useState } from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import {
  TextInput,
  Appbar,
  Avatar,
  Card,
  Text,
  FAB,
  useTheme,
} from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import { getCategories } from '../../utils/homeServices';
import { router, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_PADDING = 16;
const SPACING = 12;
const GRID_COLUMNS = 2;

const Home = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState<any>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [isGridView, setIsGridView] = useState(true);
  const theme = useTheme();

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
          icon="notebook-outline"
          size={isGridView ? 56 : 48}
          style={{
            marginBottom: isGridView ? 10 : 0,
            marginRight: isGridView ? 0 : 12,
            backgroundColor: theme.colors.primary,
          }}
          color={theme.colors.onPrimary}
        />
        <Text
          variant="titleMedium"
          style={{
            textAlign: isGridView ? 'center' : 'left',
            fontFamily: 'Inter-Medium',
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
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />

      {/* Header */}
      <Appbar.Header style={{ backgroundColor: theme.colors.background, elevation: 0 }}>
        <Appbar.Content
          title="Notebooks"
          titleStyle={{ fontFamily: 'Inter-Bold', color: theme.colors.onBackground }}
        />
        {user?.profilePic && (
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Avatar.Image
              size={36}
              source={{ uri: user.profilePic }}
              style={{ marginRight: 12 }}
            />
          </TouchableOpacity>
        )}
      </Appbar.Header>

      {/* Search & Controls */}
      <View style={{ paddingHorizontal: CARD_PADDING }}>
        <TextInput
          mode="outlined"
          placeholder="Search notes..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          left={<TextInput.Icon icon="magnify" />}
          style={{ marginBottom: 16 }}
          theme={{
            roundness: 12,
            colors: {
              primary: theme.colors.primary,
              background: theme.colors.surface,
            },
          }}
        />

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
              size={20}
              color={theme.colors.onBackground}
            />
            <Text style={{ marginLeft: 6, fontFamily: 'Inter-Regular', color: theme.colors.onBackground }}>
              View: {isGridView ? 'Grid' : 'List'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSortAsc(!sortAsc)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text style={{ marginRight: 6, fontFamily: 'Inter-Regular', color: theme.colors.onBackground }}>
              Sort by Date
            </Text>
            <MaterialIcons
              name={sortAsc ? 'arrow-upward' : 'arrow-downward'}
              size={20}
              color={theme.colors.onBackground}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid/List */}
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: CARD_PADDING,
          paddingBottom: 100,
        }}
        data={filteredSorted}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={isGridView ? GRID_COLUMNS : 1}
        key={isGridView ? 'grid' : 'list'} // force layout switch
      />

      {/* FAB */}
      <FAB
        icon="plus"
        label="New Lesson"
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
          backgroundColor: theme.colors.primary,
        }}
        color={theme.colors.onPrimary}
        onPress={() => router.push('/create')}
      />
    </View>
  );
};

export default Home;
