
import { View, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function SearchBar({ value, onChangeText }: { value: string, onChangeText: (text: string) => void }) {
  return (
    <View style={{
      backgroundColor: "#2b2b2b",
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      marginBottom: 16
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
