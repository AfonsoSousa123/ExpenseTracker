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
import { useColorScheme, View, StyleSheet } from "react-native";
import BottomNavigationBar from "./components/layout/BottomNavigationBar";

const Stack = createNativeStackNavigator();

export default function App() {
  const scheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <View style={styles.appContainer}>
        <NavigationContainer
          theme={scheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddTransaction"
              component={AddTransactionScreen}
              options={{ title: "Nova Transação", headerShown: false }}
            />
          </Stack.Navigator>
          <BottomNavigationBar />
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#000000", // Force black background globally
  },
});
