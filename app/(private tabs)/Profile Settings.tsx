import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {
  TextInput,
  Button,
  Avatar,
  Text,
  ActivityIndicator,
  Snackbar,
  Appbar,
  useTheme,
} from 'react-native-paper';
import { getUserProfile, updateUserProfile, uploadProfilePic } from '@/utils/settingsService';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePic?: string;
};

const SettingsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarError, setSnackbarError] = useState(false);

  const showSnackbar = (message: string, isError = false) => {
    setSnackbarMessage(message);
    setSnackbarError(isError);
    setSnackbarVisible(true);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userData = await SecureStore.getItemAsync('userData');
      const { id } = JSON.parse(userData || '{}');
      const profile = await getUserProfile(id);
      setUser(profile);
    } catch (error) {
      console.error('Profile fetch error:', error);
      showSnackbar('Failed to load profile', true);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: [ 'images' ],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setSelectedImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      showSnackbar('Failed to pick image', true);
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
          showSnackbar('Failed to upload image', true);
          return;
        }
      }

      if (hasChanges && user) {
        await updateUserProfile(id, user);
        setHasChanges(false);
        showSnackbar('Profile updated successfully', false);
      } else if (!selectedImage) {
        showSnackbar('No changes to update');
      }
    } catch (error: any) {
      console.log('[SAVE ERROR]', error.message);
      showSnackbar('Failed to save changes', true);
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

  if (loading) {
  return (
    <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
    </View>
  );
}


  if (!user) return <Text>Unable to load user data</Text>;

  return (
  <>
    <Appbar.Header mode="small" style={{ backgroundColor: theme.colors.background }}>
      <Appbar.BackAction onPress={() => navigation.goBack()} />
      <Appbar.Content
        title="Profile"
        titleStyle={{
          color: theme.colors.onBackground,
          fontFamily: 'Inter-Medium',
          fontSize: 16,
        }}
      />
    </Appbar.Header>

    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity
        onPress={pickImage}
        style={styles.imageContainer}
        disabled={updating}
      >
        {selectedImage ? (
          <Image source={{ uri: selectedImage.uri }} style={styles.profileImage} />
        ) : user.profilePic ? (
          <Avatar.Image size={100} source={{ uri: user.profilePic }} />
        ) : (
          <Avatar.Icon size={100} icon="account" />
        )}
        <Text style={{ marginTop: 10, fontFamily: 'Inter-Regular' }}>
          {updating ? 'Uploading...' : 'Tap to change profile picture'}
        </Text>
      </TouchableOpacity>

      <TextInput
        label="First Name"
        value={user.firstName}
        onChangeText={(text) => handleFieldChange('firstName', text)}
        style={styles.input}
        mode="outlined"
        dense
        disabled={updating}
      />
      <TextInput
        label="Last Name"
        value={user.lastName}
        onChangeText={(text) => handleFieldChange('lastName', text)}
        style={styles.input}
        mode="outlined"
        dense
        disabled={updating}
      />
      <TextInput
        label="Username"
        value={user.username}
        onChangeText={(text) => handleFieldChange('username', text)}
        style={styles.input}
        mode="outlined"
        dense
        disabled={updating}
      />
      <TextInput
        label="Email"
        value={user.email}
        onChangeText={(text) => handleFieldChange('email', text)}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        mode="outlined"
        dense
        disabled={updating}
      />

      <Button
        mode="contained"
        onPress={handleSave}
        disabled={(!hasChanges && !selectedImage) || updating}
        contentStyle={{ paddingVertical: 6 }}
        style={styles.saveButton}
      >
        {updating ? 'Saving...' : 'Save Changes'}
      </Button>
    </View>

    {updating && (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    )}

    <Snackbar
      visible={snackbarVisible}
      onDismiss={() => setSnackbarVisible(false)}
      duration={3000}
      style={{
        backgroundColor: snackbarError ? theme.colors.error : theme.colors.primary,
      }}
    >
      {snackbarMessage}
    </Snackbar>
  </>
  );

};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  input: {
    marginBottom: 12,
    borderRadius: 10,
  },
  saveButton: {
    marginTop: 12,
    borderRadius: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},

});


export default SettingsScreen;
