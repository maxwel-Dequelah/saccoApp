import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Linking from "expo-linking";

import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/dashboard";
import AccountBalance from "./components/AccountBalance";
import DepositsSharesScreen from "./components/deposits";
import CreateTransactionScreen from "./components/create-transuction";
import ApproveTransaction from "./components/ApproveTransuctions";

import ForgotPasswordScreen from "./components/ForgotPasswordScreen";
import ResetPasswordScreen from "./components/ResetPasswordScreen";

// Setup navigation
const Stack = createStackNavigator();

const linking = {
  prefixes: [Linking.createURL("/"), "tomikal://"],
  config: {
    screens: {
      Login: "",
      Register: "register",
      Dashboard: "dashboard",
      AccountBalance: "balance",
      DepositsSharesScreen: "deposits",
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ title: "Register" }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DepositsSharesScreen"
          component={DepositsSharesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AccountBalance"
          component={AccountBalance}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ApproveTransaction"
          component={ApproveTransaction}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateTransuction"
          component={CreateTransactionScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
