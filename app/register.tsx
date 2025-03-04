import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

export default function RegisterScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`http://10.0.2.2:5000/api/auth/register`, {
        firstName,
        lastName,
        username,
        email,
        password,
      });

      Alert.alert("Success", "Account created successfully!");
      router.replace("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      Alert.alert("Error", "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 5 }}>📝 Register</Text>
      <Text style={{ fontSize: 16, color: "#6c757d", marginBottom: 20 }}>Create your account</Text>

      {/* First Name */}
      <TextInput 
        placeholder="First Name"
        style={{ width: "100%", height: 50, borderWidth: 1, borderColor: "#ced4da", borderRadius: 10, paddingHorizontal: 15, marginBottom: 10, backgroundColor: "#fff", fontSize: 16 }}
        onChangeText={setFirstName} 
      />

      {/* Last Name */}
      <TextInput 
        placeholder="Last Name"
        style={{ width: "100%", height: 50, borderWidth: 1, borderColor: "#ced4da", borderRadius: 10, paddingHorizontal: 15, marginBottom: 10, backgroundColor: "#fff", fontSize: 16 }}
        onChangeText={setLastName} 
      />

      {/* Username */}
      <TextInput 
        placeholder="Username"
        style={{ width: "100%", height: 50, borderWidth: 1, borderColor: "#ced4da", borderRadius: 10, paddingHorizontal: 15, marginBottom: 10, backgroundColor: "#fff", fontSize: 16 }}
        onChangeText={setUsername} 
      />

      {/* Email */}
      <TextInput 
        placeholder="Email"
        keyboardType="email-address"
        style={{ width: "100%", height: 50, borderWidth: 1, borderColor: "#ced4da", borderRadius: 10, paddingHorizontal: 15, marginBottom: 10, backgroundColor: "#fff", fontSize: 16 }}
        onChangeText={setEmail} 
      />

      {/* Password */}
      <View style={{ flexDirection: "row", alignItems: "center", width: "100%", height: 50, borderWidth: 1, borderColor: "#ced4da", borderRadius: 10, paddingHorizontal: 15, marginBottom: 10, backgroundColor: "#fff" }}>
        <TextInput
          placeholder="Password"
          secureTextEntry={!showPassword}
          style={{ flex: 1, fontSize: 16 }}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <View style={{ flexDirection: "row", alignItems: "center", width: "100%", height: 50, borderWidth: 1, borderColor: "#ced4da", borderRadius: 10, paddingHorizontal: 15, marginBottom: 20, backgroundColor: "#fff" }}>
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry={!showPassword}
          style={{ flex: 1, fontSize: 16 }}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity 
        onPress={handleRegister} 
        style={{ width: "100%", backgroundColor: "#007bff", padding: 15, borderRadius: 10, alignItems: "center", opacity: loading ? 0.7 : 1 }}
        disabled={loading}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>{loading ? "Signing Up..." : "Sign Up"}</Text>
      </TouchableOpacity>

      {/* Navigate to Login */}
      <TouchableOpacity onPress={() => router.replace("/login")} style={{ marginTop: 10 }}>
        <Text style={{ color: "#007bff", fontSize: 16 }}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}
