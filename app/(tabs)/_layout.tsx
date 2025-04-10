import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        tabBarStyle: styles.tabBar, 
        tabBarActiveTintColor: "#5E72E4",
        tabBarInactiveTintColor: "#A0AEC0",
        tabBarLabelStyle: styles.label,
        headerShown: false,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: "Home", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="lessons" 
        options={{ 
          title: "Lessons", 
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons 
              name="book-open-page-variant" 
              color={color} 
              size={size} 
            />
          ),
        }}         
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: "Profile", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0,
    height: 60,
    paddingBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
});