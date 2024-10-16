import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from "react-native";
import RenderHTML from "react-native-render-html";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const DepositsSharesScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = await AsyncStorage.getItem("access");

        if (!token) {
          Alert.alert("Error", "Unable to fetch access token.");
          return;
        }

        const { data } = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/api/transactions/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const renderTransaction = ({ item }) => {
    const source = {
      html: `<p style="text-align:justify;">
        ${item.transaction_type === "deposit" ? "💰 Deposit" : "🔻 Withdrawal"}
        -    ${item.amount}   -  ${
        new Date(item.date).toLocaleDateString() +
        " " +
        new Date(item.date).toLocaleTimeString()
      }
      </p>`,
    };

    return (
      <View style={styles.transactionItem}>
        <RenderHTML contentWidth={width} source={source} />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTransaction}
        contentContainerStyle={styles.transactionList}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  transactionList: {
    paddingBottom: 20,
  },
  transactionItem: {
    backgroundColor: "#f9f9f9",
    padding: 5,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2, // Shadow effect on Android
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default DepositsSharesScreen;
