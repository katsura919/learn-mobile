import {
  MD3LightTheme as PaperLightTheme,
  MD3DarkTheme as PaperDarkTheme,
} from 'react-native-paper';

export const LightTheme = {
  ...PaperLightTheme,
  colors: {
    ...PaperLightTheme.colors,
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

export const DarkTheme = {
  ...PaperDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    primary: '#7DCFB6',
    secondary: '#FCE38A',
    background: '#1E293B',
    surface: '#334155',
    onPrimary: '#FFFFFF',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    accent: '#F38181',
    outline: '#475569',
  },
  roundness: 12,
};
