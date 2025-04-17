import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View, Dimensions } from "react-native";
import { useRouter } from "expo-router";



const { width } = Dimensions.get("window");

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#A0AEC0",
        tabBarLabelStyle: styles.label,
        headerShown: false,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Lessons",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-sharp" color={color} size={size} />
          ),
        }}
      />

      {/* + Button Center Tab */}
      <Tabs.Screen
        name="create"
        options={{
          title: "",
          tabBarIcon: ({ focused }) => (
            <View style={styles.plusWrapper}>
              <View style={[styles.plusButton, focused && styles.plusButtonFocused]}>
                <Ionicons name="add" size={30} color="#fff" />
              </View>
            </View>
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
    backgroundColor: "#2b2b2b",
    borderTopWidth: 0,
    height: 70,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  plusWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 13
  },
  plusButton: {
    backgroundColor: "green",
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  plusButtonFocused: {
    backgroundColor: "green",
  },
});
