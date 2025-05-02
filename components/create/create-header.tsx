import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/themeContext'; 

type AppHeaderProps = {
  title: string;
  onSave: () => void;
};

const AppHeader: React.FC<AppHeaderProps> = ({ title, onSave }) => {
  const router = useRouter();
  const { theme } = useAppTheme(); 

  return (
    <Appbar.Header style={[styles.header, { backgroundColor: theme.colors.surface }]}>
      <Appbar.BackAction color={theme.colors.onSurface} onPress={() => router.back()} />
      <Appbar.Content
        title={title}
        titleStyle={{ fontFamily: 'Inter-Bold', fontSize: 16, color: theme.colors.onSurface }}
      />
      <Appbar.Action icon="check" color={theme.colors.primary} onPress={onSave} />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    elevation: 4,
  },
});

export default AppHeader;
