export type Transaction = {
  id: string;
  type: "income" | "expense";
  title: string;
  amount: number;
  category: string;
  date: string;
};
