import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

export default function Login({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  const handleLogin = async () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    setIsButtonPressed(true);
    if (username === "" || password === "") {
      Alert.alert("Error", "Please enter both username and password.");
      setIsButtonPressed(false);
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/login/`,
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.data.tokens; // Access the tokens object
      if (token && token.access) {
        // Store the access token in AsyncStorage
        await AsyncStorage.setItem("access", token.access);
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

        navigation.navigate("Dashboard");
      } else {
        throw new Error("Access token not found in the response.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Handle errors from the server
        const errorMessages = Object.values(error.response.data)
          .flat()
          .join("\n");
        Alert.alert(
          "Login Error",
          errorMessages || "Invalid credentials. Please try again."
        );
      } else {
        // Handle network or other errors
        Alert.alert("Error", "Something went wrong. Please try again later.");
      }
    } finally {
      setIsButtonPressed(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Styled Login Button */}
      <TouchableOpacity
        style={[
          styles.button,
          isButtonPressed ? styles.buttonPressed : styles.buttonNormal,
        ]}
        onPress={handleLogin}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {isButtonPressed ? "Processing..." : "Login"}
        </Text>
      </TouchableOpacity>

      {/* Link to Register page */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        style={styles.registerLinkContainer}
      >
        <Text style={styles.registerLinkText}>
          Don't have an account? Register instead
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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  button: {
    width: "80%",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonNormal: {
    backgroundColor: "#38a169",
  },
  buttonPressed: {
    backgroundColor: "#e53e3e",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerLinkContainer: {
    marginTop: 20,
  },
  registerLinkText: {
    color: "#1e90ff",
    textDecorationLine: "underline",
    fontSize: 16,
  },
});
