import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";

export default function Register({ navigation }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phoneNumber: "",
    dob: "",
    password: "",
  });
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [date, setDate] = useState(new Date("2000-01-01"));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    const { first_name, last_name, phoneNumber, dob, password } = formData;

    if (!first_name || !last_name || !phoneNumber || !dob || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/signup/`, formData);
      Alert.alert("Success", "Registered successfully!");
      navigation.navigate("Login");
    } catch (error) {
      const errorMessages =
        error.response && error.response.data
          ? Object.values(error.response.data).flat().join("\n")
          : "Registration failed. Please try again.";
      Alert.alert("Error", errorMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      handleInputChange("dob", selectedDate.toISOString().split("T")[0]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={formData.first_name}
        onChangeText={(value) => handleInputChange("first_name", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={formData.last_name}
        onChangeText={(value) => handleInputChange("last_name", value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="numeric"
        value={formData.phoneNumber}
        onChangeText={(value) => handleInputChange("phoneNumber", value)}
      />

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.datePicker}
      >
        <FontAwesome
          name="calendar"
          size={20}
          color="black"
          style={styles.icon}
        />
        <Text style={styles.dateText}>
          {formData.dob || "Date of Birth (YYYY-MM-DD)"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={new Date(2010, 0, 1)}
          onChange={onDateChange}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(value) => handleInputChange("password", value)}
      />

      <TouchableOpacity
        style={[
          styles.button,
          isLoading ? styles.buttonDisabled : styles.buttonEnabled,
        ]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Registering..." : "Register"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={styles.loginLink}
      >
        <Text style={styles.loginText}>Already have an account? Login</Text>
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
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  icon: {
    marginRight: 10,
  },
  dateText: {
    flex: 1,
  },
  button: {
    width: "80%",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonEnabled: {
    backgroundColor: "#38a169",
  },
  buttonDisabled: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    color: "#1e90ff",
    textDecorationLine: "underline",
    fontSize: 16,
  },
});
