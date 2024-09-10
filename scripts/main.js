import Expense from "./classes/Expense.js";
import Category from "./classes/Category.js";
import expenseReducer from "./redux/reducer.js";
import store from "./redux/store.js";
import Tracker from "./utils/Tracker.js";
import { initApp } from "./app.js";

const tracker = new Tracker();

document.addEventListener("DOMContentLoaded", initApp);

export { Expense, Category, expenseReducer, store, Tracker };
