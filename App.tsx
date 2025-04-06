import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import AddTransactionScreen from "./screens/AddTransactionScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  const scheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="AddTransaction"
            component={AddTransactionScreen}
            options={{ title: "Nova Transação" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
