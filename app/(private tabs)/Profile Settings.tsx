import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { TextInput, Button, Avatar, Text, ActivityIndicator } from 'react-native-paper';
import { getUserProfile, updateUserProfile, uploadProfilePic } from '@/utils/settingsService';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';

// Define user type for better TypeScript support
type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePic?: string;
};

const SettingsScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userData = await SecureStore.getItemAsync('userData');
      const { id } = JSON.parse(userData || '{}');
      const profile = await getUserProfile(id);
      setUser(profile);
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: [ 'images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSave = async () => {
    try {
      setUpdating(true);
      const userData = await SecureStore.getItemAsync('userData');
      const { id } = JSON.parse(userData || '{}');

      if (selectedImage) {
        try {
          const updated = await uploadProfilePic(id, selectedImage);
          setUser(updated);
          setSelectedImage(null);
        } catch (error: any) {
          console.log('[SAVE ERROR] Image upload failed:', error.message);
          Alert.alert('Error', 'Failed to upload image');
          return;
        }
      }

      if (hasChanges && user) {
        await updateUserProfile(id, user);
        Alert.alert('Success', 'Profile updated');
      }
    } catch (error: any) {
      console.log('[SAVE ERROR]', error.message);
      Alert.alert('Error', 'Failed to save');
    } finally {
      setUpdating(false);
    }
  };

  const handleFieldChange = (field: keyof User, value: string) => {
    if (user) {
      setUser({ ...user, [field]: value });
      setHasChanges(true);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, [])
  );

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} animating={true} />;

  if (!user) return <Text>Unable to load user data</Text>;

  return (
    <View style={{ padding: 20 }}>
      <TouchableOpacity
        onPress={pickImage}
        style={{ alignItems: 'center', marginBottom: 20 }}
        disabled={updating}
      >
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage.uri }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        ) : user.profilePic ? (
          <Avatar.Image size={100} source={{ uri: user.profilePic }} />
        ) : (
          <Avatar.Icon size={100} icon="account" />
        )}
        <Text style={{ marginTop: 10 }}>
          {updating ? 'Uploading...' : 'Tap to change profile picture'}
        </Text>
      </TouchableOpacity>

      <TextInput
        label="First Name"
        value={user.firstName}
        onChangeText={(text) => handleFieldChange('firstName', text)}
        style={{ marginBottom: 10 }}
        disabled={updating}
      />
      <TextInput
        label="Last Name"
        value={user.lastName}
        onChangeText={(text) => handleFieldChange('lastName', text)}
        style={{ marginBottom: 10 }}
        disabled={updating}
      />
      <TextInput
        label="Username"
        value={user.username}
        onChangeText={(text) => handleFieldChange('username', text)}
        style={{ marginBottom: 10 }}
        disabled={updating}
      />
      <TextInput
        label="Email"
        value={user.email}
        onChangeText={(text) => handleFieldChange('email', text)}
        style={{ marginBottom: 20 }}
        keyboardType="email-address"
        autoCapitalize="none"
        disabled={updating}
      />

      <Button
        mode="contained"
        loading={updating}
        onPress={handleSave}
        disabled={!hasChanges && !selectedImage || updating}
      >
        {updating ? 'Saving...' : 'Save Changes'}
      </Button>
    </View>
  );
};

export default SettingsScreen;
