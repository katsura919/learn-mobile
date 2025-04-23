
import { View, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function SearchBar({ value, onChangeText }: { value: string, onChangeText: (text: string) => void }) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingHorizontal: 12,
      paddingVertical: 1,
      borderRadius: 12,
      marginBottom: 20,
      elevation: 2,
    }}>
      <Feather name="search" size={20} color="#aaa" />
      <TextInput
        placeholder="Search your lessons"
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        style={{
          color: "white",
          marginLeft: 10,
          flex: 1
        }}
      />
    </View>
  );
}
