import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

export default function CreateTransactionScreen() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState("deposit");
  const [narration, setNarration] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        const token = await AsyncStorage.getItem("access");
        const response = await axios.get(`${apiUrl}/api/users/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to load users.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    if (!selectedUser || !amount || isNaN(parseFloat(amount))) {
      Alert.alert(
        "Validation Error",
        "Please select a user and enter a valid amount."
      );
      return;
    }

    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const token = await AsyncStorage.getItem("access");

      const payload = {
        user: selectedUser,
        amount: parseFloat(amount),
        transaction_type: transactionType,
      };

      await axios.post(`${apiUrl}/api/transactions/create/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      Alert.alert("Success", "Transaction created and sent for approval.");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data &&
        Object.values(error.response.data).flat().join("\n");
      Alert.alert("Error", msg || "Something went wrong.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38a169" />
        <Text>Loading users...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Transaction</Text>

      <Text style={styles.label}>Select User</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedUser}
          onValueChange={(itemValue) => setSelectedUser(itemValue)}
        >
          <Picker.Item label="-- Select User --" value="" />
          {users.map((user) => (
            <Picker.Item
              key={user.id}
              label={`${user.first_name} ${user.last_name}- ${user.phoneNumber}`}
              value={user.id}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Transaction Type</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={transactionType}
          onValueChange={(itemValue) => setTransactionType(itemValue)}
        >
          <Picker.Item label="Deposit" value="deposit" />
          <Picker.Item label="Withdrawal" value="withdrawal" />
          <Picker.Item label="Emergency Deposit" value="emergency" />
        </Picker>
      </View>

      {/* <Text style={styles.label}>Narration (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter narration"
        value={narration}
        onChangeText={setNarration}
      /> */}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Transaction</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontWeight: "600",
    marginTop: 10,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#38a169",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
