// theme.ts
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#7DCFB6',
    secondary: '#FCE38A',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    onPrimary: '#1E293B',
    onBackground: '#1E293B',
    onSurface: '#1E293B',
    accent: '#F38181',
    outline: '#E2E8F0',
  },
  roundness: 12,
};
