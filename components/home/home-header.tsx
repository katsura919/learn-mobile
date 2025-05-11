// components/AppHeader.tsx
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Appbar, Avatar, Text } from 'react-native-paper';
import { useAppTheme } from '@/hooks/themeContext';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { getUserProfile } from '@/utils/settingsService'; 

const AppHeader = () => {
  const { theme, isDark, toggleTheme } = useAppTheme();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const stored = await SecureStore.getItemAsync('userData');
        const parsed = stored ? JSON.parse(stored) : null;

        if (parsed?.id) {
          const userData = await getUserProfile(parsed.id); 
          setUser(userData);
        }
      } catch (err) {
        console.log('Error fetching user profile:', err);
      }
    };

    fetchUser();
  }, []);

  return (
    <Appbar.Header
      style={{
        backgroundColor: theme.colors.background,
        elevation: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
      }}
    >
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
  );
};

export default AppHeader;
