import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/dashboard"; // Import the Dashboard component
import AccountBalance from "./components/AccountBalance";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Define the Register screen */}
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ title: "Register" }}
        />

        {/* Define the Login screen with header hidden */}
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }} // Hides the header (back arrow)
        />

        {/* Define the Dashboard screen */}
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ headerShown: false }} // Hides the header for Dashboard too
        />
        <Stack.Screen
          name="AccountBalance"
          component={AccountBalance}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
