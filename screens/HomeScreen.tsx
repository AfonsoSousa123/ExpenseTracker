import React, { useEffect, useState } from "react";
import {
  ScrollView,
  FlatList,
  Text,
  StyleSheet,
  View,
  Button,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Transaction } from "../types/Transaction";
import TransactionItem from "../components/TransactionItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConfirmModal from "../components/modals/ConfirmModal";

const STORAGE_KEY = "@transactions";

const HomeScreen = () => {
  const isFocused = useIsFocused();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(
    null
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  const loadTransactions = async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsedTransactions = JSON.parse(data);
      const sortedTransactions = parsedTransactions.sort(
        (a: Transaction, b: Transaction) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setTransactions(sortedTransactions);
    }
  };

  const onDelete = async (id: string) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTransactions);
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedTransactions)
    );
  };

  const handleDeleteRequest = (id: string) => {
    setSelectedTransaction(id);
    setModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTransaction) {
      onDelete(selectedTransaction);
    }
    setModalVisible(false);
    setSelectedTransaction(null);
  };

  const handleCancelDelete = () => {
    setModalVisible(false);
    setSelectedTransaction(null);
  };

  useEffect(() => {
    if (isFocused) loadTransactions();
  }, [isFocused]);

  const balance = transactions.reduce(
    (acc, curr) =>
      curr.type === "income" ? acc + curr.amount : acc - curr.amount,
    0
  );

  // Filter transactions based on the selected filter
  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true;
    return transaction.type === filter;
  });

  return (
    <>
      <Text style={styles.header}>Balance: {balance}€</Text>

      <View style={styles.filterContainer}>
        <Button
          color={"#007076"}
          title="All"
          onPress={() => setFilter("all")}
        />
        <Button
          color={"#007076"}
          title="Income"
          onPress={() => setFilter("income")}
        />
        <Button
          color={"#007076"}
          title="Expenses"
          onPress={() => setFilter("expense")}
        />
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              transaction={item}
              onDelete={handleDeleteRequest}
            />
          )}
          scrollEnabled={isFocused}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.listContent}
        />
      </View>

      <ConfirmModal
        visible={isModalVisible}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="Are you sure you want to delete this transaction?"
      />
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#007076",
    paddingVertical: 40,
    paddingHorizontal: 20,
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
    height: 120,
    color: "#ffffff",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#000000",
    paddingVertical: 10,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#000000",
  },
  listContent: {
    paddingBottom: 16,
  },
});
