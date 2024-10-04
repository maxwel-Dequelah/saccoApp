import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook

const AccountBalance = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [balance, setBalance] = useState(null); // State for balance
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigation = useNavigation(); // Initialize navigation

  useEffect(() => {
    // Function to fetch balance from the backend with bearer token
    const fetchBalance = async () => {
      try {
        // Get the bearer token from AsyncStorage
        const token = await AsyncStorage.getItem("access");

        if (!token) {
          setError("No access token found");
          setLoading(false);
          return;
        }

        // Make the API request with the token in the Authorization header
        const response = await axios.get(`${apiUrl}/api/balance/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { balance } = response.data;
        setBalance(balance); // Set the balance from the response
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        console.error("Error fetching balance:", err);
        setError("Failed to fetch balance");
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  if (loading) {
    // Show loading spinner while balance is being fetched
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    // Show error message if something went wrong
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.balanceText}>Your Balance</Text>
      <Text style={styles.amount}>Ksh {parseFloat(balance).toFixed(2)}</Text>

      {/* Back to Dashboard Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Dashboard")} // Navigate back to Dashboard
      >
        <Text style={styles.backButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  balanceText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  amount: {
    fontSize: 40,
    color: "#4CAF50",
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  backButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default AccountBalance;
