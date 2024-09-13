import Category from "../classes/Category.js";

let state = {
  expenses: [],
  categories: {
    Comida: new Category("Comida"),
    Transporte: new Category("Transporte"),
    Servicios: new Category("Servicios"),
    Entretenimiento: new Category("Entretenimiento"),
    Otros: new Category("Otros"),
  },
};

const listeners = [];

export function getState() {
  return state;
}

export function setState(newState) {
  state = { ...state, ...newState };
  notifyListeners();
}

export function subscribe(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}
