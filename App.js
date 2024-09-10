import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/dashboard"; // Import the Dashboard component

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        {/* Define the Register screen */}
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ title: "Register" }}
        />

        {/* Define the Login screen */}
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Login" }}
        />

        {/* Define the Dashboard screen */}
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ title: "Member Dashboard" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
