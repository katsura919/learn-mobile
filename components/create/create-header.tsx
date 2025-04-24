import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { theme} from '@/hooks/theme';
type AppHeaderProps = {
  title: string;
  onSave: () => void;
};

const AppHeader: React.FC<AppHeaderProps> = ({ title, onSave }) => {
  const router = useRouter();

  return (
    <Appbar.Header style={styles.header}>
      <Appbar.BackAction onPress={() => router.back()} />
      <Appbar.Content title={title}  titleStyle={{ fontFamily: 'Inter-Bold', alignItems: 'center',color: theme.colors.onBackground }} />
      <Appbar.Action icon="check" onPress={onSave} />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'white',
    elevation: 4,
  },
});

export default AppHeader;
