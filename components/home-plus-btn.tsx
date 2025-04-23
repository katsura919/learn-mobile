import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
const PlusButton = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push("/create");
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.button}>
        <LottieView
                  source={require("../assets/lotties/plus.json")}
                  autoPlay
                  loop
                  style={{ width: 100, height: 100, opacity: 0.8 }}
                  />
      </View>
    </TouchableOpacity>
  );
};

export default PlusButton;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    right: 24,
    zIndex: 100,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 20
  },
});
