import expenseReducer from "./reducer.js";
import Category from "../classes/Category.js";

class Store {
  constructor(initialState) {
    this.state = initialState;
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  dispatch(action) {
    this.state = expenseReducer(this.state, action);
    this.notifyListeners();
    this.saveToLocalStorage(); // Añadir esta línea
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  saveToLocalStorage() {
    localStorage.setItem("expenseTracker", JSON.stringify(this.state));
  }
}

const initialState = {
  expenses: [],
  categories: {
    Comida: new Category("Comida"),
    Transporte: new Category("Transporte"),
    Servicios: new Category("Servicios"),
    Entretenimiento: new Category("Entretenimiento"),
    Otros: new Category("Otros"),
  },
};

const store = new Store(initialState);

export default store;
