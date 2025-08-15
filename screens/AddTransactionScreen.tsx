import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
const CATEGORY_KEY = "@categories";

const AddTransactionScreen = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [type, setType] = useState<"income" | "expense" | "">("");
  const navigation = useNavigation();

  useEffect(() => {
    const loadCategories = async () => {
      const data = await AsyncStorage.getItem(CATEGORY_KEY);
      if (data) setCategories(JSON.parse(data));
    };
    loadCategories();
  }, []);

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

    const usedCategory = category || "not set";
    const newTransaction: Transaction = {
      id: uuid.v4().toString(),
      title,
      amount: parseFloat(normalizedAmount),
      category: usedCategory,
      type,
      date: new Date().toISOString().split("T")[0],
    };

    // Save transaction
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const transactions = existing ? JSON.parse(existing) : [];
    transactions.push(newTransaction);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));

    // Save new category if not already present
    if (category && !categories.includes(category)) {
      const updatedCategories = [...categories, category];
      setCategories(updatedCategories);
      await AsyncStorage.setItem(
        CATEGORY_KEY,
        JSON.stringify(updatedCategories)
      );
    }

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

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0} // adjust as needed for your header
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter title"
            placeholderTextColor="#555555" // Customize placeholder color
          />
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
            placeholder="Enter amount (e.g. 100.00)"
            placeholderTextColor="#555555" // Customize placeholder color
          />
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={setCategory}
              style={styles.picker}
            >
              <Picker.Item label="Select Category" value="" />
              {categories.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="Or type a new category"
            placeholderTextColor="#555555" // Customize placeholder color
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

          <TouchableOpacity
            style={{
              zIndex: 1,
              padding: 10,
              backgroundColor: "#007645",
              borderRadius: 20,
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
              justifyContent: "center",
            }}
            onPress={() => handleSave()}
          >
            <Text style={styles.save}>SAVE</Text>
            <Ionicons name="add" size={32} color="#fff" />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  save: {
    color: "#ffffff",
    fontSize: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: "#007076",
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    color: "#ffffff", // Text color
    backgroundColor: "#000000", // Background color
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
    overflow: "hidden", // Ensures the picker fits within the container
    backgroundColor: "#000000", // Background for the container
  },
  picker: {
    color: "#ffffff", // Text color inside the picker
    backgroundColor: "#000000", // Background color for the picker
    height: 50, // Adjust height
  },
});
