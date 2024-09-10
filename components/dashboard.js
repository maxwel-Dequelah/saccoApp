import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";

// Sample member data (JSON object)
const memberData = [
  {
    id: 1,
    name: "John Doe",
    monthly_contribution: 5000,
    month: "August",
    year: 2024,
    payment_date: "2024-08-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    monthly_contribution: 4500,
    month: "August",
    year: 2024,
    payment_date: "2024-08-10",
  },
  {
    id: 3,
    name: "Robert Johnson",
    monthly_contribution: 6000,
    month: "August",
    year: 2024,
    payment_date: "2024-08-12",
  },
  {
    id: 4,
    name: "Emily Davis",
    monthly_contribution: 7000,
    month: "August",
    year: 2024,
    payment_date: "2024-08-20",
  },
  {
    id: 1,
    name: "John Doe",
    monthly_contribution: 5000,
    month: "August",
    year: 2024,
    payment_date: "2024-08-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    monthly_contribution: 4500,
    month: "August",
    year: 2024,
    payment_date: "2024-08-10",
  },
  {
    id: 3,
    name: "Robert Johnson",
    monthly_contribution: 6000,
    month: "August",
    year: 2024,
    payment_date: "2024-08-12",
  },
  {
    id: 4,
    name: "Emily Davis",
    monthly_contribution: 7000,
    month: "August",
    year: 2024,
    payment_date: "2024-08-20",
  },
];

export default function MemberDetails() {
  const [members, setMembers] = useState([]);
  const [totalContribution, setTotalContribution] = useState(0);

  useEffect(() => {
    const fetchMembers = async () => {
      // Simulate an API call by setting the static JSON data
      const membersData = memberData;

      // Calculate total contribution
      const total = membersData.reduce(
        (sum, member) => sum + member.monthly_contribution,
        0
      );

      setMembers(membersData);
      setTotalContribution(total);
    };

    fetchMembers();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Member Contributions</Text>

      {/* Table header */}
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>Avatar</Text>
        <Text style={styles.headerText}>Member Name</Text>
        <Text style={styles.headerText}>Monthly Contribution (Ksh)</Text>
        <Text style={styles.headerText}>Month & Year</Text>
        <Text style={styles.headerText}>Payment Date</Text>
      </View>

      {/* Render member details */}
      {members.map((member) => (
        <View key={member.id} style={styles.tableRow}>
          <Image
            source={require("../assets/profile2.jpeg")}
            style={styles.avatar}
          />
          <Text style={styles.cell}>{member.name}</Text>
          <Text style={styles.cell}>{member.monthly_contribution}</Text>
          <Text style={styles.cell}>{`${member.month}, ${member.year}`}</Text>
          <Text style={styles.cell}>{member.payment_date}</Text>
        </View>
      ))}

      {/* Total contribution */}
      <View style={styles.totalRow}>
        <Text style={styles.totalText}>Total Contribution:</Text>
        <Text style={styles.totalText}>{totalContribution} Ksh</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",

    overflow: "scroll",
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    marginBottom: 50,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
