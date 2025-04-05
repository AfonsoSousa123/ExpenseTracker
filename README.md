# 💸 Expense Tracker (React Native + Expo)

A simple personal finance tracker built with **React Native**, **Expo**, and **TypeScript**.

## 🚀 Features

- Add transactions with title, amount, category and type (income or expense)
- List transactions
- Calculate and display total balance
- Store data locally using **AsyncStorage**

## 🧰 Tech Stack

- [Expo](https://expo.dev/)
- React Native
- TypeScript
- React Navigation
- AsyncStorage
- UUID

## 📦 Installation

1. Clone the repository
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm start
    ```
4. Open the app in your preferred simulator or physical device using the Expo Go app.
5. You can also run the app on a web browser using:
    ```bash
    npm run web
    ```
6. For Android, you can run the app using:
    ```bash
    npm run android
    ```
7. For iOS, you can run the app using:
    ```bash
    npm run ios
    ```
## 📁 Project Structure
    .
    ├── App.tsx
    ├── screens/
    │   ├── HomeScreen.tsx
    │   └── AddTransactionScreen.tsx
    ├── components/
    │   └── TransactionItem.tsx
    ├── types/
    │   └── Transaction.ts

## 📌 Notes

- All data is stored locally with AsyncStorage.
- UUIDs are used to uniquely identify each transaction.
- The app is designed to be simple and user-friendly.

## 🛠️ To Do (Optional Improvements)

- Allow editing or deleting transactions
- Add filtering by date or category
- Integrate charts with react-native-svg for better visualization