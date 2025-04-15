import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;  
console.log('API URL:', apiUrl); 

const api = axios.create({
  baseURL: apiUrl,  
});


api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.error('Request Error:', error);  
  return Promise.reject(error);
});

export default api;
