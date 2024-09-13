import * as db from "../utils/db.js";
import { getState, setState } from "./store.js";

export async function addExpense(expense) {
  await db.addExpense(expense);
  const newExpenses = [...getState().expenses, expense];
  setState({ expenses: newExpenses });
}

export async function editExpense(expense) {
  await db.updateExpense(expense);
  const newExpenses = getState().expenses.map((e) =>
    e.id === expense.id ? expense : e
  );
  setState({ expenses: newExpenses });
}

export async function deleteExpense(id) {
  await db.deleteExpense(id);
  const newExpenses = getState().expenses.filter((e) => e.id !== id);
  setState({ expenses: newExpenses });
}

export async function loadExpenses() {
  const expenses = await db.getAllExpenses();
  setState({ expenses });
}
