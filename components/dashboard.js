import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const Card = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Text style={styles.icon}>{icon}</Text>
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
  </TouchableOpacity>
);

const Dashboard = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Failed to fetch user from storage", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            navigation.navigate("Login");
          } catch (err) {
            Alert.alert("Error", "Failed to logout");
          }
        },
      },
    ]);
  };

  const renderCards = () => {
    if (!user) return null;

    const cards = [
      { icon: "💰", title: "Account Balance", screen: "AccountBalance" },
      {
        icon: "💼",
        title: "Deposits/Shares Contribs",
        screen: "DepositsSharesScreen",
      },
      { icon: "📱", title: "Loan Requests", screen: "LoanRequestScreen" },
      { icon: "💳", title: "Loans", screen: "LoansScreen" },
    ];

    if (user.is_secretary) {
      cards.push(
        { icon: "✅", title: "Approve Users", screen: "ApproveUsersScreen" },
        {
          icon: "🧾",
          title: "Capture Transactions",
          screen: "CaptureTransactionScreen",
        },
        { icon: "➕", title: "Capture Loans", screen: "CaptureLoanScreen" }
      );
    }

    if (user.is_tresurer) {
      cards.push(
        {
          icon: "✔️",
          title: "Approve Transactions",
          screen: "ApproveTransactionsScreen",
        },
        { icon: "✔️", title: "Approve Loans", screen: "ApproveLoansScreen" }
      );
    }

    return cards.map((card, index) => (
      <Card
        key={index}
        icon={card.icon}
        title={card.title}
        onPress={() => navigation.navigate(card.screen)}
      />
    ));
  };

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.stickyHeader}>
        <ImageBackground
          source={require("../assets/sacco_logo.jpeg")}
          style={styles.headerBackground}
        >
          <Text style={styles.headerTitle}>Tomikal SHG</Text>
          <Text style={styles.accountText}>{user?.username}</Text>
          <Text style={styles.accountNumber}>
            {user ? user.id.toUpperCase() : "waiting"}
          </Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.cardContainer}>{renderCards()}</View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.bottomButton}>
            <Text style={styles.bottomButtonText}>Mini Statements</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton}>
            <Text style={styles.bottomButtonText}>Stop ATM</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  stickyHeader: { zIndex: 10 },
  headerBackground: {
    width: "100%",
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  headerTitle: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  accountText: { color: "#fff", fontSize: 18 },
  accountNumber: { color: "#fff", fontSize: 16, marginTop: 5 },

  logoutButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
    backgroundColor: "#e53e3e",
    borderRadius: 5,
  },
  logoutText: { color: "#fff", fontSize: 14 },

  scrollView: { flex: 1, marginBottom: "40" },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: "auto",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    width: "40%",
    margin: 10,
    padding: 20,
    alignItems: "center",
    borderRadius: 10,
    elevation: 3,
  },
  iconContainer: { fontSize: 60 },
  icon: { fontSize: 50 },
  cardTitle: { marginTop: 10, fontSize: 16 },

  bottomContainer: { alignItems: "center", marginBottom: 20 },
  bottomButton: {
    marginTop: 20,
    width: "90%",
    padding: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    alignItems: "center",
  },
  bottomButtonText: { color: "#fff", fontSize: 16 },
});

export default Dashboard;
