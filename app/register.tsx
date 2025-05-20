import { View, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { Text, TextInput, Button, Snackbar } from "react-native-paper";

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
  const [error, setError] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarColor, setSnackbarColor] = useState("red");
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const handleRegister = async () => {
  if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
    setError("All fields are required.");
    setSnackbarColor("#ff3d51");
    setSnackbarVisible(true);
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    setSnackbarColor("#ff3d51");
    setSnackbarVisible(true);
    return;
  }

  try {
    setLoading(true);
    await axios.post(`${apiUrl}/auth/register`, {
      firstName,
      lastName,
      username,
      email,
      password,
    });

    setSnackbarColor("#51cf66");
    setError("Account created successfully!");
    setSnackbarVisible(true);
    setTimeout(() => router.replace("/login"), 1500);
  } catch (err: any) {
    const serverErrors = err.response?.data?.errors;
    if (Array.isArray(serverErrors) && serverErrors.length > 0) {
      setError(serverErrors.join("\n"));
    } else {
      setError("Registration failed. Please try again.");
    }
    setSnackbarColor("#ff3d51");
    setSnackbarVisible(true);
  } finally {
    setLoading(false);
  }
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <Animatable.View animation="fadeInDown" duration={800}>
        <LottieView
          source={require("../assets/lotties/register.json")}
          autoPlay
          loop
          style={{ width: 250, height: 250, alignSelf: "center" }}
        />
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={200} style={styles.form}>
        <Text variant="headlineMedium" style={styles.title}>REGISTER</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Create a new account</Text>

        {step === 1 ? (
          <>
            <TextInput label="First Name" value={firstName} onChangeText={setFirstName} style={styles.input} textColor="#fff" underlineColor="#555" activeUnderlineColor="#fff" placeholderTextColor="#888" theme={{ colors: { primary: "#fff" } }} left={<TextInput.Icon icon={() => <MaterialIcons name="person" size={20} color="#ccc" />} />} />
            <TextInput label="Last Name" value={lastName} onChangeText={setLastName} style={styles.input} textColor="#fff" underlineColor="#555" activeUnderlineColor="#fff" placeholderTextColor="#888" theme={{ colors: { primary: "#fff" } }} left={<TextInput.Icon icon={() => <MaterialIcons name="person" size={20} color="#ccc" />} />} />
            <TextInput label="Username" value={username} onChangeText={setUsername} style={styles.input} textColor="#fff" underlineColor="#555" activeUnderlineColor="#fff" placeholderTextColor="#888" theme={{ colors: { primary: "#fff" } }} left={<TextInput.Icon icon={() => <MaterialIcons name="account-circle" size={20} color="#ccc" />} />} />
            <TextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} textColor="#fff" underlineColor="#555" activeUnderlineColor="#fff" placeholderTextColor="#888" theme={{ colors: { primary: "#fff" } }} left={<TextInput.Icon icon={() => <MaterialIcons name="email" size={20} color="#ccc" />} />} />
          </>
        ) : (
          <>
            <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} style={styles.input} textColor="#fff" underlineColor="#555" activeUnderlineColor="#fff" placeholderTextColor="#888" theme={{ colors: { primary: "#fff" } }} left={<TextInput.Icon icon={() => <MaterialIcons name="lock" size={20} color="#ccc" />} />} right={<TextInput.Icon icon={() => <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color="#ccc" />} onPress={() => setShowPassword((prev) => !prev)} />} />
            <TextInput label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showPassword} style={styles.input} textColor="#fff" underlineColor="#555" activeUnderlineColor="#fff" placeholderTextColor="#888" theme={{ colors: { primary: "#fff" } }} left={<TextInput.Icon icon={() => <MaterialIcons name="lock" size={20} color="#ccc" />} />} right={<TextInput.Icon icon={() => <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={20} color="#ccc" />} onPress={() => setShowPassword((prev) => !prev)} />} />
          </>
        )}

       <Button
          mode="contained"
          onPress={() => (step === 1 ? setStep(2) : handleRegister())}
          style={[
            styles.button,
            step === 1 && (!firstName || !lastName || !username || !email) ? styles.buttonDisabled : null,
          ]}
          contentStyle={{ paddingVertical: 8 }}
          loading={loading}
          disabled={
            loading || (step === 1 && (!firstName || !lastName || !username || !email))
          }
          labelStyle={{
            color:
              step === 1 && (!firstName || !lastName || !username || !email)
                ? "#999"
                : "#000",
          }}
        >
          {step === 1 ? "Next" : "Register"}
        </Button>

        {step === 2 && (
          <Button
            mode="outlined"
            onPress={() => setStep(1)}
            style={styles.backButton}
            textColor="#fff"
            contentStyle={{ paddingVertical: 6 }}
          >
            Back
          </Button>
        )}

        <Button
          onPress={() => router.replace("/login")}
          mode="text"
          textColor="#aaa"
          style={{ marginTop: 8 }}
        >
          Already have an account? Sign in
        </Button>
        </Animatable.View>

        <View style={styles.snackbarContainer}>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={3000}
            style={[styles.snackbar, { backgroundColor: snackbarColor }]}
          >
            {error}
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
    fontFamily: 'Inter-Bold'
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

  buttonDisabled: {
  backgroundColor: "#ccc",
  },
  backButton: {
    borderColor: "#fff",
    marginTop: 10,
  },
  snackbarContainer: {
  position: "absolute",
  bottom: 10,
  left: 0,
  right: 0,
  paddingHorizontal: 10,
},

snackbar: {
  borderRadius: 10,
  width: "100%",
},

});