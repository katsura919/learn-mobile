// src/hooks/useTheme.ts
import { useColorScheme } from 'react-native';
import { colors } from './colors';

export const useTheme = () => {
  const colorScheme = useColorScheme();
  
  return {
    colors,
    isDark: colorScheme === 'dark'
  };
};