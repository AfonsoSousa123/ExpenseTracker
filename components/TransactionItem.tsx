import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Transaction } from "../types/Transaction";

const TransactionItem = ({
  transaction,
  onDelete,
}: {
  transaction: Transaction;
  onDelete?: (id: string) => void;
}) => {
  return (
    <View style={styles.item}>
      <View>
        <Text style={styles.title}>{transaction.title}</Text>
        <Text style={styles.category}>{transaction.category}</Text>
      </View>
      <View style={styles.rightSection}>
        <Text
          style={{
            color: transaction.type === "income" ? "green" : "red",
            marginRight: 8,
          }}
        >
          {transaction.type === "income" ? "+" : "-"}
          {transaction.amount}€
        </Text>
        {onDelete && (
          <TouchableOpacity onPress={() => onDelete(transaction.id)}>
            <Text style={styles.delete}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TransactionItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 15,
    borderColor: "#007076",
  },
  title: {
    fontWeight: "bold",
    color: "#ffffff",
    fontSize: 18,
  },
  delete: {
    color: "#b20606",
    fontSize: 18,
  },
  category: {
    color: "#09a1f1",
    fontSize: 12,
    marginTop: 4,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
