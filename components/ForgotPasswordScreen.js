import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function ForgotPasswordScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async () => {
    if (phone.trim().length < 10) {
      Alert.alert("Error", "Please enter a valid phone number.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${apiUrl}/api/password-reset/request/`, { phone });
      Alert.alert("Success", "OTP sent via WhatsApp and/or Email.");
      navigation.navigate("ResetPassword", { phone });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        keyboardType="numeric"
        value={phone}
        onChangeText={setPhone}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleRequestOTP}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Sending..." : "Send OTP"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "90%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
