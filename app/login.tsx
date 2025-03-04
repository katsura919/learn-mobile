import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    if (email.trim() === "" || password.trim() === "") {
      setError("Email and password are required.");
      return;
    }

    try {
      const response = await axios.post(`http://10.0.2.2:5000/api/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      await SecureStore.setItemAsync("userToken", token);
      await SecureStore.setItemAsync("userData", JSON.stringify(user));

      router.replace("/(tabs)/home");
    } catch (err: any) {
      console.log(err)
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20, backgroundColor: "#f8f9fa" }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 10 }}>🔑 Login</Text>
      <Text style={{ fontSize: 16, color: "#6c757d", marginBottom: 20 }}>Enter your credentials to continue</Text>

      <View style={{ width: "100%", marginBottom: 10 }}>
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          style={{
            width: "100%",
            height: 50,
            borderWidth: 1,
            borderColor: error ? "#dc3545" : "#ced4da",
            borderRadius: 10,
            paddingHorizontal: 15,
            backgroundColor: "#fff",
            fontSize: 16,
          }}
          onChangeText={(text) => {
            setEmail(text);
            setError("");
          }}
        />
      </View>

      <View style={{ width: "100%", marginBottom: 10 }}>
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={{
            width: "100%",
            height: 50,
            borderWidth: 1,
            borderColor: error ? "#dc3545" : "#ced4da",
            borderRadius: 10,
            paddingHorizontal: 15,
            backgroundColor: "#fff",
            fontSize: 16,
          }}
          onChangeText={(text) => {
            setPassword(text);
            setError("");
          }}
        />
      </View>

      {error ? <Text style={{ color: "#dc3545", marginBottom: 10 }}>{error}</Text> : null}

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "#007bff",
          paddingVertical: 14,
          paddingHorizontal: 30,
          borderRadius: 10,
          width: "100%",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 3,
        }}
        activeOpacity={0.8}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")} style={{ marginTop: 10 }}>
        <Text style={{ color: "#007bff", fontSize: 16 }}>Don't have an account? Sign up</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}
