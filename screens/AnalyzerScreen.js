import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../lib/supabase";

export default function AnalyzerScreen() {
  const navigation = useNavigation();
  const [url, setUrl] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [remainingScans, setRemainingScans] = useState(0);

  // Fetch logged-in user and their subscription data
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

  // Check remaining scans from Supabase
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

  // Handle website analysis
  const handleAnalyze = async () => {
    if (!url)
      return Alert.alert("Missing URL", "Please enter a website to check.");

    if (!/^https?:\/\/\S+/i.test(url.trim())) {
      return Alert.alert(
        "Invalid URL",
        "Please enter a full URL starting with http(s)://"
      );
    }

    if (remainingScans <= 0) {
      return navigation.replace("Paywall");
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://myresellermentor.com/api/supplier-analyzer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-trustify-app": "true", // optional: to identify requests from the app
          },
          body: JSON.stringify({ input: url }),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json?.error || "Error running analysis");
      }

      setResult(json.data);

      // Save scan in Supabase
      await supabase.from("scan_logs").insert([
        {
          user_id: user.id,
          website_url: url,
          result: json.data,
          trust_score: json.data.trust_score,
        },
      ]);

      // Increment scan usage count
      await supabase.rpc("increment_scan_count", { uid: user.id });
      await checkScanLimit(user.id);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>🔒 Trustify</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter supplier website"
          placeholderTextColor="#aaa"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleAnalyze}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Analyzing..." : "Run Check"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.counter}>
          {remainingScans > 0
            ? `${remainingScans} scans left`
            : "Upgrade to continue"}
        </Text>

        {result && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>
              Trust Score: {Math.round(result.trust_score)} / 100
            </Text>
            <Text style={styles.resultText}>
              Risk Level: {result.risk_level}
            </Text>

            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.resultText}>{result.summary}</Text>

            <Text style={styles.sectionTitle}>Positives</Text>
            {result.positives?.length ? (
              result.positives.map((p, i) => (
                <Text key={i} style={styles.resultText}>
                  ✅ {p}
                </Text>
              ))
            ) : (
              <Text style={styles.resultText}>None detected.</Text>
            )}

            <Text style={styles.sectionTitle}>Red Flags</Text>
            {result.red_flags?.length ? (
              result.red_flags.map((r, i) => (
                <Text key={i} style={[styles.resultText, { color: "#ff7373" }]}>
                  ⚠️ {r}
                </Text>
              ))
            ) : (
              <Text style={styles.resultText}>None detected.</Text>
            )}

            <Text style={styles.disclaimer}>
              ⚠️ Always validate with a small test order. This AI report is
              informational only and not legal advice.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0C10",
  },
  scroll: {
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  title: {
    color: "#00C2A8",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#1F2833",
    color: "#FFF",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    borderColor: "#00C2A8",
    borderWidth: 1,
    marginBottom: 20,
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
  sectionTitle: {
    color: "#00C2A8",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  resultText: {
    color: "#FFF",
    marginBottom: 4,
  },
  disclaimer: {
    color: "#888",
    fontSize: 12,
    marginTop: 15,
  },
  counter: { color: "#00C2A8", marginTop: 10, fontSize: 14 },
});

