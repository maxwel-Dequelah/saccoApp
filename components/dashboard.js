import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook

// Reusable Card component with larger icons
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
  const [user, setUser] = useState("");
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  // Fetch user information from AsyncStorage
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error fetching username from AsyncStorage:", error);
      }
    };

    fetchUsername();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await AsyncStorage.clear(); // Clear AsyncStorage
              navigation.navigate("Login"); // Navigate to Login page
            } catch (error) {
              Alert.alert("Error", "Something went wrong. Please try again.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <ImageBackground
        source={require("../assets/sacco_logo.jpeg")} // Add your background image
        style={styles.headerBackground}
      >
        <Text style={styles.headerTitle}>Tomikal SHG</Text>
        <Text style={styles.accountText}>{user.username}</Text>
        <Text style={styles.accountNumber}>
          {user ? user.id.toUpperCase() : "waiting"}
        </Text>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ImageBackground>

      {/* Cards Section */}
      <View style={styles.cardContainer}>
        <Card
          icon="💰"
          title="Account Balance"
          onPress={() => navigation.navigate("AccountBalance")}
        />
        <Card
          icon="💼"
          title="Deposits/Shares Contribs"
          onPress={() => navigation.navigate("DepositsSharesScreen")}
        />

        <Card icon="📱" title="Loan Requests" onPress={() => {}} />
        <Card icon="💳" title="Loans" onPress={() => {}} />
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomButtonText}>Mini Statements</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton}>
          <Text style={styles.bottomButtonText}>Stop ATM</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerBackground: {
    width: "100%",
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  accountText: {
    color: "#fff",
    fontSize: 18,
  },
  accountNumber: {
    color: "#fff",
    fontSize: 16,
    marginTop: 5,
  },
  logoutButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
    backgroundColor: "#e53e3e",
    borderRadius: 5,
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 20,
  },
  card: {
    marginTop: 20,
    backgroundColor: "#f9f9f9",
    minWidth: "40%",
    width: "40%",
    maxWidth: "40%",
    margin: 10,
    padding: 20,
    alignItems: "center",
    borderRadius: 10,
    elevation: 3, // Adds shadow for Android
  },
  cardTitle: {
    marginTop: 10,
    fontSize: 16,
  },
  iconContainer: {
    fontSize: 60,
  },
  icon: {
    fontSize: 50, // Increase the icon size
  },
  bottomContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  bottomButton: {
    marginTop: 20,
    width: "90%",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    alignItems: "center",
  },
  bottomButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Dashboard;
