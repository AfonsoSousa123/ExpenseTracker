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
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Install expo/vector-icons if needed
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
    const normalizedAmount = amount.replace(",", ".");
    if (
      !title ||
      !normalizedAmount ||
      !type ||
      isNaN(Number(normalizedAmount)) ||
      !/^\d*\.?\d{0,2}$/.test(normalizedAmount)
    ) {
      Alert.alert(
        "Error",
        "Fill all fields with valid values (max 2 decimals)"
      );
      return;
    }

    const newTransaction: Transaction = {
      id: uuid.v4().toString(),
      title,
      amount: parseFloat(normalizedAmount),
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
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 40,
          left: 20,
          zIndex: 1,
          padding: 5,
          backgroundColor: "#003d42",
          borderRadius: 50,
        }}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={32} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.header}>New Transaction</Text>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={(text) => {
            // Allow numbers with up to 2 decimals, using . or ,
            if (/^\d*([.,]?\d{0,2})?$/.test(text)) {
              setAmount(text);
            }
          }}
          keyboardType="decimal-pad"
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
