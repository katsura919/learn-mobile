import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        tabBarStyle: { backgroundColor: "#f8f8f8", paddingBottom: 5 }, 
        tabBarActiveTintColor: "blue",
        headerShown: false,
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: "Home", 
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} /> 
        }} 
      />
      <Tabs.Screen 
        name="lessons" 
        options={{ 
          title: "Lessons", 
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} /> 
        }}         
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: "Profile", 
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} /> 
        }} 
      />
    </Tabs>
  );
}
