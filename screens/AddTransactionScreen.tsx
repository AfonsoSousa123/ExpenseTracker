import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
// @ts-ignore
import { useNavigation } from "@react-navigation/native";
import { Transaction } from "../types/Transaction";

const STORAGE_KEY = "@transactions";

const AddTransactionScreen = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"income" | "expense" | "">("");
  const navigation = useNavigation();

  const handleSave = async () => {
    if (!title || !amount || !category || !type) {
      Alert.alert("Error", "Fill all fields");
      return;
    }

    const newTransaction: Transaction = {
      id: uuid.v4().toString(),
      title,
      amount: parseFloat(amount),
      category,
      type,
      date: new Date().toISOString().split("T")[0],
    };

    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const transactions = existing ? JSON.parse(existing) : [];
    transactions.push(newTransaction);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />
      <Text style={styles.label}>Type (income or expense)</Text>
      <TextInput
        style={styles.input}
        value={type}
        onChangeText={(v) => setType(v as "income" | "expense")}
      />
      <Button color={"#007076"} title="Save" onPress={handleSave} />
    </View>
  );
};

export default AddTransactionScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#000000" },
  input: {
    borderWidth: 1,
    color: "#ffffff",
    borderColor: "#007076",
    padding: 15,
    marginBottom: 12,
    borderRadius: 8,
  },
  label: {
    color: "#ffffff",
    marginBottom: 12,
    fontSize: 18,
  },
  saveBtn: {
    marginTop: 30,
    color: "#007076",
  },
});
