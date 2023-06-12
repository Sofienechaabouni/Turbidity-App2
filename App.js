import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import UserCamera from "./UserCamera";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import Insitu from "./Insitu";
import Inlab from "./Inlab";
import UserDashboard from "./UserDashboard";
const Stack = createStackNavigator();
const defaultScreenOptions = {
  title: "Hannini",
  headerStyle: { backgroundColor: "#ffffff" },
  headerTitleStyle: {
    fontWeight: "bold",
    fontFamily: "serif",
  },
};
export default function App() {
  const [value, setValue] = useState(null);

  return (
    <>
      <StatusBar hidden={true} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={defaultScreenOptions}
        >
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ title: "Login", headerShown: false }}
          />
          <Stack.Screen
            name="AdminDashboard"
            component={AdminDashboard}
            options={{ title: "AdminDashboard", headerShown: false }}
          />
          <Stack.Screen
            name="Camera"
            component={UserCamera}
            options={{ title: "camera", headerShown: false }}
          />
          <Stack.Screen
            name="Inlab"
            component={Inlab}
            options={{ title: "Inlab", headerShown: false }}
          />
          <Stack.Screen
            name="Insitu"
            component={Insitu}
            options={{ title: "Insitu", headerShown: false }}
          />
          <Stack.Screen
            name="UserDashboard"
            component={UserDashboard}
            options={{ title: "UserDashboard", headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
