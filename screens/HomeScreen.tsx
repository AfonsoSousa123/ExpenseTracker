import React, { useEffect, useState } from "react";
import { FlatList, Text, StyleSheet } from "react-native";
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

  const loadTransactions = async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) setTransactions(JSON.parse(data));
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

  return (
    <>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem transaction={item} onDelete={handleDeleteRequest} />
        )}
        ListHeaderComponent={
          <Text style={styles.header}>Balance: {balance}€</Text>
        }
        contentContainerStyle={styles.container}
      />
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
  container: {
    padding: 16,
    backgroundColor: "#000000",
    height: "100%",
  },
  header: {
    backgroundColor: "#007076",
    borderRadius: 8,
    padding: 14,
    fontSize: 24,
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 16,
    color: "#ffffff",
  },
});
