import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { signIn, signUp } from "../lib/auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) return alert("Please enter email and password.");
    setLoading(true);
    try {
      if (isSignup) {
        await signUp(email, password);
        alert("Check your email for a confirmation link.");
      } else {
        await signIn(email, password);
        navigation.replace("Analyzer");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>🔒 Trustify Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Loading..." : isSignup ? "Sign Up" : "Log In"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
        <Text style={styles.link}>
          {isSignup ? "Already have an account? Log in" : "New user? Sign up"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0C10",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "#00C2A8",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
  },
  input: {
    backgroundColor: "#1F2833",
    color: "#FFF",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#00C2A8",
  },
  button: {
    backgroundColor: "#00C2A8",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#0B0C10",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#FFF",
    marginTop: 20,
    textDecorationLine: "underline",
  },
});
