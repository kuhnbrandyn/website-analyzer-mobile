import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from "react-native";
import { supabase } from "../lib/supabase";

export default function AnalyzerScreen() {
  const [url, setUrl] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [remainingScans, setRemainingScans] = useState(0);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        await checkScanLimit(data.user.id);
      }
    };
    getUser();
  }, []);

  const checkScanLimit = async (userId) => {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("scans_used, scans_limit, plan")
      .eq("user_id", userId)
      .single();

    if (sub) {
      const remaining = sub.scans_limit - sub.scans_used;
      setRemainingScans(remaining);
    }
  };

  const handleAnalyze = async () => {
    if (!url) return Alert.alert("Missing URL", "Please enter a website to check.");
    if (remainingScans <= 0) return Alert.alert("Limit reached", "You’ve used all your free scans. Upgrade to Pro for unlimited checks.");

    setLoading(true);
    try {
      // Simulate scan result
      const mockResult = {
        trustScore: Math.floor(Math.random() * 20) + 80,
        flags: ["Valid SSL certificate", "No scam reports", "Domain age: 3+ years"],
      };
      setResult(mockResult);

      // Log scan
      await supabase.from("scan_logs").insert([
        { user_id: user.id, website_url: url, result: mockResult, trust_score: mockResult.trustScore },
      ]);

      // Increment usage count
      await supabase.rpc("increment_scan_count", { uid: user.id });

      await checkScanLimit(user.id);
    } catch (err) {
      Alert.alert("Error", "Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Trustify</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter supplier website"
        placeholderTextColor="#aaa"
        value={url}
        onChangeText={setUrl}
      />
      <TouchableOpacity style={styles.button} onPress={handleAnalyze} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Analyzing..." : "Run Check"}</Text>
      </TouchableOpacity>

      <Text style={styles.counter}>
        {remainingScans > 0 ? `${remainingScans} scans left` : "Upgrade to continue"}
      </Text>

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Trust Score: {result.trustScore}%</Text>
          {result.flags.map((f, i) => (
            <Text key={i} style={styles.resultText}>• {f}</Text>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0C10", alignItems: "center", justifyContent: "center", padding: 20 },
  title: { color: "#00C2A8", fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: { backgroundColor: "#1F2833", color: "#FFF", width: "100%", padding: 15, borderRadius: 10, borderColor: "#00C2A8", borderWidth: 1, marginBottom: 20 },
  button: { backgroundColor: "#00C2A8", padding: 15, borderRadius: 10, width: "100%", alignItems: "center" },
  buttonText: { color: "#0B0C10", fontWeight: "bold" },
  resultBox: { marginTop: 30, backgroundColor: "#1F2833", padding: 20, borderRadius: 10, width: "100%" },
  resultTitle: { color: "#00C2A8", fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  resultText: { color: "#FFF" },
  counter: { color: "#00C2A8", marginTop: 10, fontSize: 14 },
});
