import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import axios from "axios";

const UpdateProfile = ({ user }) => {
  const [formData, setFormData] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    dob: user.dob || "",
    email: user.email || "",
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `http://yourapiurl.com/users/${user.id}/update/`,
        formData
      );
      if (response.status === 200) {
        Alert.alert(
          "Profile Updated",
          "Your profile has been updated successfully"
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong while updating the profile");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        value={formData.first_name}
        onChangeText={(value) => handleInputChange("first_name", value)}
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        value={formData.last_name}
        onChangeText={(value) => handleInputChange("last_name", value)}
      />

      <Text style={styles.label}>Date of Birth</Text>
      <TextInput
        style={styles.input}
        value={formData.dob}
        onChangeText={(value) => handleInputChange("dob", value)}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={formData.email}
        onChangeText={(value) => handleInputChange("email", value)}
      />

      <Button title="Update Profile" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
  },
});

export default UpdateProfile;
