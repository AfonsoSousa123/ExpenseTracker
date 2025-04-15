import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// @ts-ignore
import { useNavigation } from "@react-navigation/native";

const BottomNavigationBar = () => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const navigation = useNavigation();

  const buttons = [
    { id: "home", label: "Home", emoji: "🏠", screen: "Home" },
    {
      id: "newTransaction",
      label: "New Transaction",
      emoji: "➕",
      screen: "AddTransaction",
    },
  ];

  return (
    <View style={styles.container}>
      {buttons.map((button) => (
        <View key={button.id} style={styles.buttonWrapper}>
          {activeButton === button.id && (
            <Text style={styles.tooltip}>{button.label}</Text>
          )}
          <TouchableOpacity
            style={[
              styles.button,
              activeButton === button.id && styles.activeButton,
            ]}
            onPressIn={() => setActiveButton(button.id)}
            onPressOut={() => setActiveButton(null)}
            onPress={() => navigation.navigate(button.screen as never)}
          >
            <Text style={styles.emoji}>{button.emoji}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default BottomNavigationBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#000000",
    padding: 10,
    shadowColor: "#006f75",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonWrapper: {
    alignItems: "center",
  },
  tooltip: {
    position: "absolute",
    top: -30,
    backgroundColor: "black",
    color: "white",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
    fontSize: 10,
  },
  button: {
    backgroundColor: "#006f75",
    padding: 10,
    borderRadius: 50,
    transform: [{ translateY: 0 }, { scale: 1 }],
    transition: "transform 0.3s",
  },
  activeButton: {
    transform: [{ translateY: -10 }, { scale: 1.2 }],
  },
  emoji: {
    fontSize: 20,
  },
});
