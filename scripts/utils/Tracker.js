import store from "../redux/store.js";
import Expense from "../classes/Expense.js";
import Category from "../classes/Category.js";

class Tracker {
  constructor() {
    this.loadFromLocalStorage();
  }

  loadFromLocalStorage() {
    const savedData = localStorage.getItem("expenseTracker");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      const loadedState = {
        expenses: parsedData.expenses.map(
          (expenseData) =>
            new Expense(
              expenseData.id,
              expenseData.amount,
              expenseData.description,
              expenseData.date,
              expenseData.category
            )
        ),
        categories: Object.fromEntries(
          Object.entries(parsedData.categories).map(
            ([categoryName, categoryData]) => [
              categoryName,
              new Category(
                categoryName,
                categoryData.expenses.map(
                  (expenseData) =>
                    new Expense(
                      expenseData.id,
                      expenseData.amount,
                      expenseData.description,
                      expenseData.date,
                      expenseData.category
                    )
                )
              ),
            ]
          )
        ),
      };
      store.dispatch({ type: "LOAD_EXPENSES", payload: loadedState });
    }
  }
}

export default Tracker;
