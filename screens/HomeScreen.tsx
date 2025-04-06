import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
// @ts-ignore
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Transaction } from "../types/Transaction";
import TransactionItem from "../components/TransactionItem";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@transactions";

const HomeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadTransactions = async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) setTransactions(JSON.parse(data));
  };

  useEffect(() => {
    if (isFocused) loadTransactions();
  }, [isFocused]);

  const balance = transactions.reduce(
    (acc, curr) =>
      curr.type === "income" ? acc + curr.amount : acc - curr.amount,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Balance: {balance}€</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
      />
      <Button
        title="+ New Transaction"
        color="#007076"
        onPress={() => navigation.navigate("AddTransaction" as never)}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#000000",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#ffffff",
  },
});
