import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { checkTrustScore } from "../lib/supabase";

export default function AnalyzerScreen() {
  const [url, setUrl] = React.useState("");
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleAnalyze = async () => {
    if (!url) return alert("Please enter a website URL.");
    setLoading(true);
    setResult(null);

    try {
      // 🔹 Real call (once Supabase Edge Function is ready)
      const data = await checkTrustScore(url);

      // Fallback demo data for now
      setResult(
        data || {
          trustScore: "92%",
          flags: ["Domain age: 5+ years", "Valid SSL certificate", "No scam reports detected"],
        }
      );
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>🔒 Trustify</Text>
      <Text style={styles.subtitle}>Instant Supplier Website Analyzer</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter website URL"
        placeholderTextColor="#999"
        value={url}
        onChangeText={setUrl}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleAnalyze} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Analyzing..." : "Run Trust Check"}</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>✅ Trust Score: {result.trustScore}</Text>
          {result.flags.map((flag, i) => (
            <Text key={i} style={styles.resultText}>
              • {flag}
            </Text>
          ))}
        </View>
      )}
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
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#1F2833",
    color: "#FFF",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
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
  resultBox: {
    marginTop: 30,
    backgroundColor: "#1F2833",
    padding: 20,
    borderRadius: 10,
    width: "100%",
  },
  resultTitle: {
    color: "#00C2A8",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  resultText: {
    color: "#FFF",
    fontSize: 14,
    marginVertical: 2,
  },
});
