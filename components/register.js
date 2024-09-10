import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Register({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date("2000-01-01"));

  const handleRegister = async () => {
    if (
      firstName === "" ||
      lastName === "" ||
      phoneNumber === "" ||
      dob === "" ||
      password === ""
    ) {
      Alert.alert("Error", "Please fill in all the fields.");
    } else {
      try {
        const response = await fetch("http://192.168.0.120:8000/signup/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            dob: dob,
            password: password,
          }),
        });

        if (response.ok) {
          Alert.alert("Success", "Registered successfully!");
          navigation.navigate("Dashboard");
        } else {
          Alert.alert("Error", "Registration failed. Please try again.");
        }
      } catch (error) {
        Alert.alert("Error", "Something went wrong. Please try again later.");
      }
    }
  };

  // Handle date change from the date picker
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Close the date picker after selection
    if (selectedDate) {
      setDate(selectedDate);
      setDob(selectedDate.toISOString().split("T")[0]); // Format the date as YYYY-MM-DD
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="numeric"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      {/* Date of Birth Picker */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <View style={styles.input}>
          <Text>{dob ? dob : "Date of Birth (YYYY-MM-DD)"}</Text>
        </View>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={new Date(2010, 0, 1)} // Latest date selectable is 2010 Jan 1
          onChange={onDateChange}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingBottom: 50, // Added paddingBottom
    backgroundColor: "#f8f8f8",
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
    borderRadius: 5,
    backgroundColor: "#fff",
  },
});
