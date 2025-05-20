import { View, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import axios from "axios";
import * as Animatable from "react-native-animatable";
import { MaterialIcons } from '@expo/vector-icons';
import {
  Text,
  TextInput,
  Button,
  Snackbar,
} from "react-native-paper";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("#ed4561");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      setSnackbarMessage("Username and password are required.");
      setSnackbarColor("#ff3d51");
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        username,
        password,
      });

      const { token, user } = response.data;
      await SecureStore.setItemAsync("userToken", token);
      await SecureStore.setItemAsync("userData", JSON.stringify(user));

      setSnackbarMessage("Login successful!");
      setSnackbarColor("#45ed69");
      setSnackbarVisible(true);

      setTimeout(() => {
        router.replace("/(tabs)/home");
      }, 500); // slight delay for UX
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.message ||
        "Login failed. Please try again.";
      setSnackbarMessage(message);
      setSnackbarColor("#ff3d51");
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Animatable.View animation="fadeInDown" duration={800}>
        <LottieView
          source={require("../assets/lotties/login.json")}
          autoPlay
          loop
          style={{ width: 250, height: 250, alignSelf: "center" }}
        />
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={200} style={styles.form}>
        <Text variant="headlineMedium" style={styles.title}>
          WELCOME BACK
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Login to continue
        </Text>

        <TextInput
          label="Username"
          mode="flat"
          value={username}
          onChangeText={(text) => setUsername(text)}
          style={styles.input}
          textColor="#fff"
          underlineColor="#555"
          activeUnderlineColor="#fff"
          placeholderTextColor="#888"
          theme={{ colors: { primary: "#fff" } }}
          left={<TextInput.Icon icon={() => <MaterialIcons name="person" size={20} color="#ccc" />} />}
        />

        <TextInput
          label="Password"
          mode="flat"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          textColor="#fff"
          underlineColor="#555"
          activeUnderlineColor="#fff"
          placeholderTextColor="#888"
          theme={{ colors: { primary: "#fff" } }}
          left={<TextInput.Icon icon={() => <MaterialIcons name="lock" size={20} color="#ccc" />} />}
          right={
            <TextInput.Icon
              icon={() => (
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={20}
                  color="#ccc"
                />
              )}
              onPress={() => setShowPassword((prev) => !prev)}
            />
          }
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          contentStyle={{ paddingVertical: 8 }}
          loading={loading}
          disabled={loading}
          textColor=""
        >
          Login
        </Button>


        <Button
          onPress={() => router.push("/register")}
          mode="text"
          textColor="#aaa"
          style={{ marginTop: 8 }}
        >
          Don't have an account? Sign up
        </Button>
      </Animatable.View>

     <View style={styles.snackbarWrapper}>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={[styles.snackbar, { backgroundColor: snackbarColor }]}
        >
          {snackbarMessage}
        </Snackbar>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  form: {
    marginTop: 10,
  },
  title: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    color: "#aaa",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "transparent",
    marginBottom: 10,
  },
  button: {
    borderRadius: 30,
    marginTop: 10,
    backgroundColor: "#ffffff",
  },
  snackbarWrapper: {
    position: "absolute",
    marginHorizontal:10,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999, 
  },
  snackbar: {
    borderRadius: 10,
    marginHorizontal: 0, 
    elevation: 6, 

  },

});
