import {
  MD3LightTheme as PaperLightTheme,
  MD3DarkTheme as PaperDarkTheme,
} from 'react-native-paper';

export const LightTheme = {
  ...PaperLightTheme,
  colors: {
    ...PaperLightTheme.colors,
    primary: '#000000',
    secondary: '#000000',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    onPrimary: '#FFFFFF',
    onBackground: '#000000',
    onSurface: '#000000',
    accent: '#000000',
    outline: '#E5E5E5',
  },
  roundness: 12,
};

export const DarkTheme = {
  ...PaperDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    primary: '#FFFFFF',
    secondary: '#FFFFFF',
    background: '#000000',
    surface: '#1A1A1A',
    onPrimary: '#000000',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
    accent: '#FFFFFF',
    outline: '#333333',
  },
  roundness: 12,
};
