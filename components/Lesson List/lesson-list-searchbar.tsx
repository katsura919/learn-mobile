import { View, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { useAppTheme } from "@/hooks/themeContext";

export default function SearchBar({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  const { theme } = useAppTheme();
  const { colors } = theme;

  return (
    <View style={{ paddingHorizontal: 16}}>
      <TextInput
        mode="outlined"
        placeholder="Search your lessons"
        value={value}
        onChangeText={onChangeText}
        left={<TextInput.Icon icon="magnify" size={20} />}
        style={styles.input}
        theme={{
          roundness: 6,
          colors: {
            primary: colors.primary,
            background: colors.surface,
            text: colors.onSurface,
            placeholder: colors.outline,
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 16,
    height: 45,
  },
});
