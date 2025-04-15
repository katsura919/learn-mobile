import { View, Text, TextInput, TouchableOpacity, Alert, StatusBar } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL; 
  console.log('API URL:', apiUrl);
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
      const response = await axios.post(`${apiUrl}auth/register`, {
        firstName,
        lastName,
        username,
        email,
        password,
      });

      Alert.alert("Success", "Account created successfully!");
      router.replace("/login");
    } catch (error:any) {
      console.error("Registration failed:", error);
      Alert.alert("Error", error.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, paddingTop: 30, justifyContent: "center", backgroundColor: "#f8f9fa" }}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <LottieView
          source={step === 1 ? require("../assets/lotties/hello.json") : require("../assets/lotties/register.json")}
          autoPlay
          loop
          style={{ width: 250, height: 250 }}
        />

        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>📝 Register</Text>
        <Text style={{ fontSize: 16, color: "#6c757d", marginBottom: 10 }}>Create your account</Text>

        {/* Fixed height wrapper for inputs */}
        <View style={{ width: "100%", minHeight: 300, justifyContent: "center" }}>
          {step === 1 ? (
            <>
              <TextInput
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                style={{ width: "100%", height: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 30, paddingHorizontal: 15, marginBottom: 10, backgroundColor: "#fff", fontSize: 16 }}
              />
              <TextInput
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                style={{ width: "100%", height: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 30, paddingHorizontal: 15, marginBottom: 10, backgroundColor: "#fff", fontSize: 16 }}
              />
              <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={{ width: "100%", height: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 30, paddingHorizontal: 15, marginBottom: 10, backgroundColor: "#fff", fontSize: 16 }}
              />
              <TextInput
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                style={{ width: "100%", height: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 30, paddingHorizontal: 15, marginBottom: 10, backgroundColor: "#fff", fontSize: 16 }}
              />
            </>
          ) : (
            <>
              <View style={{ flexDirection: "row", alignItems: "center", width: "100%", height: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 30, paddingHorizontal: 15, marginBottom: 10, backgroundColor: "#fff" }}>
                <TextInput
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  style={{ flex: 1, fontSize: 16 }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", width: "100%", height: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 30, paddingHorizontal: 15, marginBottom: 10, backgroundColor: "#fff" }}>
                <TextInput
                  placeholder="Confirm Password"
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  style={{ flex: 1, fontSize: 16 }}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <TouchableOpacity onPress={() => router.replace("/login")} style={{ marginTop: 10 }}>
          <Text style={{ color: "#007bff", fontSize: 16 }}>Already have an account? Sign in</Text>
        </TouchableOpacity>

        {/* Navigation buttons and dots */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", marginTop: 20, marginBottom: 20}}>
          <TouchableOpacity
            disabled={step === 1}
            onPress={() => setStep(step - 1)}
          >
            <Text style={{ fontSize: 16, color: step === 1 ? "#ccc" : "black" }}>BACK</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 50, backgroundColor: step === 1 ? "#007bff" : "#ccc", marginHorizontal: 5 }} />
            <View style={{ width: 10, height: 10, borderRadius: 50, backgroundColor: step === 2 ? "#007bff" : "#ccc", marginHorizontal: 5 }} />
          </View>

          <TouchableOpacity
            onPress={() => {
              if (step === 1) setStep(2);
              else handleRegister();
            }}
          >
            <Text style={{ fontSize: 16, color: "black" }}>{step === 1 ? "NEXT" : loading ? "REGISTERING..." : "REGISTER"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
