import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
// @ts-ignore
import { useNavigation } from "@react-navigation/native";
import { Transaction } from "../types/Transaction";
import { Picker } from "@react-native-picker/picker";

const STORAGE_KEY = "@transactions";

const AddTransactionScreen = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"income" | "expense" | "">("");
  const navigation = useNavigation();

  const handleSave = async () => {
    if (!title || !amount || !type) {
      Alert.alert("Error", "Fill all fields");
      return;
    }

    const newTransaction: Transaction = {
      id: uuid.v4().toString(),
      title,
      amount: parseFloat(amount),
      category: "not set",
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
    <>
      <Text style={styles.header}>New Transaction</Text>

      <ScrollView contentContainerStyle={styles.container}>
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
        <Text style={styles.label}>Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={type}
            onValueChange={(value) => setType(value as "income" | "expense")}
            style={styles.picker}
          >
            <Picker.Item label="Select Type" value="" />
            <Picker.Item label="Income" value="income" />
            <Picker.Item label="Expense" value="expense" />
          </Picker>
        </View>
        <Button color={"#007076"} title="Save +" onPress={handleSave} />
      </ScrollView>
    </>
  );
};

export default AddTransactionScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#000000",
  },
  header: {
    backgroundColor: "#007076",
    // borderRadius: 8,
    paddingVertical: 40,
    paddingHorizontal: 20,
    fontSize: 26,
    textAlign: "center",
    fontWeight: "bold",
    height: 120,
    color: "#ffffff",
  },
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#007076",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
  },
  picker: {
    color: "#ffffff",
    backgroundColor: "#000000",
  },
});
