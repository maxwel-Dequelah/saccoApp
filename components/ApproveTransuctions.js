import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const PendingTransactionsScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);

  const loadTokenAndFetch = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("access");
      if (!storedToken) {
        Alert.alert("Error", "Authentication token not found.");
        return;
      }
      await fetchPendingTransactions(storedToken);
    } catch (err) {
      console.error("Token error:", err);
      Alert.alert("Error", "Could not load token.");
    }
  };

  const fetchPendingTransactions = async (authToken) => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/transactions/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const pending = response.data.filter(
        (t) => t.status === "pending" || t.status === "Pending"
      );
      setTransactions(pending);
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Failed to fetch transactions.");
    } finally {
      setLoading(false);
    }
  };

  const approveTransaction = async (transactionId) => {
    Alert.alert(
      "Confirm Approval",
      "Are you sure you want to approve this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: async () => {
            try {
              setApprovingId(transactionId);
              const token = await AsyncStorage.getItem("access");
              if (!token) throw new Error("Token missing.");

              await axios.put(
                `${apiUrl}/api/transactions/${transactionId}/approve/`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              Alert.alert("Success", "Transaction approved.");
              setTransactions((prev) =>
                prev.filter((t) => t.id !== transactionId)
              );
            } catch (error) {
              console.error(
                "Approval error:",
                error?.response || error.message
              );
              Alert.alert(
                "Error",
                error?.response?.data?.error || "Approval failed."
              );
            } finally {
              setApprovingId(null);
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    loadTokenAndFetch();
  }, []);

  const renderItem = ({ item }) => {
    const user = item.user;
    const timeAgo = dayjs(item.date).fromNow();

    return (
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>Name:</Text>
          <Text>
            {user.first_name} {user.last_name}
          </Text>
          <Text style={styles.label}>Phone:</Text>
          <Text>{user.phoneNumber}</Text>
          <Text style={styles.label}>Amount:</Text>
          <Text>KES {parseFloat(item.amount).toLocaleString()}</Text>
          <Text style={styles.label}>Date:</Text>
          <Text>{timeAgo}</Text>
        </View>
        <View style={styles.actionCol}>
          <Button
            title={approvingId === item.id ? "Approving..." : "Approve"}
            onPress={() => approveTransaction(item.id)}
            color="#2E7D32"
            disabled={approvingId === item.id}
          />
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text>Loading transactions...</Text>
      </View>
    );
  }

  if (transactions.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No pending transactions found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
};

export default PendingTransactionsScreen;

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    marginBottom: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
  },
  col: {
    flex: 3,
  },
  actionCol: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    fontWeight: "bold",
    marginTop: 4,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
