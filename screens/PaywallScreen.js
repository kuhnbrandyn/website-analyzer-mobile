import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Linking } from "react-native";

export default function PaywallScreen({ navigation }) {
  const handleUpgrade = () => {
    // For now, just mock the upgrade flow
    alert("Upgrade feature coming soon! You'll unlock unlimited scans once subscribed.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🚀 Upgrade to Trustify Pro</Text>
      <Text style={styles.subtitle}>
        Unlock unlimited supplier scans, instant scam detection, and full AI trust reports.
      </Text>

      <View style={styles.benefits}>
        <Text style={styles.benefit}>✅ Unlimited website checks</Text>
        <Text style={styles.benefit}>✅ Advanced scam pattern analysis</Text>
        <Text style={styles.benefit}>✅ Real-time Trust Score updates</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpgrade}>
        <Text style={styles.buttonText}>Upgrade for $9.99/month</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace("Analyzer")}>
        <Text style={styles.backLink}>Maybe later</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Payments will be handled through the App Store or Stripe on release.
      </Text>
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
    textAlign: "center",
    marginBottom: 20,
  },
  subtitle: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 30,
  },
  benefits: {
    marginBottom: 40,
  },
  benefit: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 10,
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
    fontSize: 16,
  },
  backLink: {
    color: "#FFF",
    marginTop: 20,
    textDecorationLine: "underline",
  },
  footer: {
    color: "#777",
    fontSize: 12,
    textAlign: "center",
    marginTop: 40,
  },
});
