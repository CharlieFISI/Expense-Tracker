import Expense from "./classes/Expense.js";
import store from "./redux/store.js";

export function initApp() {
  const form = document.getElementById("expenseForm");
  const expenseList = document.getElementById("expenseList");
  const totalExpenses = document.getElementById("totalExpenses");
  const submitBtn = document.getElementById("submitBtn");

  let editingExpenseId = null;

  function updateUI() {
    expenseList.innerHTML = "";
    const state = store.getState();
    state.expenses.forEach((expense) => {
      const li = document.createElement("li");
      li.className = "expense-list__item";
      li.innerHTML = `
                ${expense.description} - $${expense.amount} (${expense.category}) - ${expense.date}
                <button class="expense-list__edit-btn" data-id="${expense.id}">Editar</button>
                <button class="expense-list__delete-btn" data-id="${expense.id}">Eliminar</button>
            `;
      expenseList.appendChild(li);
    });
    totalExpenses.textContent = `$${getTotalExpenses().toFixed(2)}`;
  }

  function getTotalExpenses() {
    return store
      .getState()
      .expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById("amount").value);
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;

    if (editingExpenseId) {
      const editedExpense = new Expense(
        editingExpenseId,
        amount,
        description,
        date,
        category
      );
      store.dispatch({ type: "EDIT_EXPENSE", payload: editedExpense });
      editingExpenseId = null;
      submitBtn.textContent = "Agregar Gasto";
    } else {
      const newExpense = new Expense(
        Date.now(),
        amount,
        description,
        date,
        category
      );
      store.dispatch({ type: "ADD_EXPENSE", payload: newExpense });
    }

    updateUI();
    form.reset();
  });

  expenseList.addEventListener("click", (e) => {
    if (e.target.classList.contains("expense-list__edit-btn")) {
      const expenseId = parseInt(e.target.getAttribute("data-id"));
      const expenseToEdit = store
        .getState()
        .expenses.find((expense) => expense.id === expenseId);
      if (expenseToEdit) {
        document.getElementById("expenseId").value = expenseToEdit.id;
        document.getElementById("amount").value = expenseToEdit.amount;
        document.getElementById("description").value =
          expenseToEdit.description;
        document.getElementById("date").value = expenseToEdit.date;
        document.getElementById("category").value = expenseToEdit.category;
        submitBtn.textContent = "Actualizar Gasto";
        editingExpenseId = expenseId;
      }
    } else if (e.target.classList.contains("expense-list__delete-btn")) {
      const expenseId = parseInt(e.target.getAttribute("data-id"));
      store.dispatch({ type: "DELETE_EXPENSE", payload: expenseId });
      updateUI();
    }
  });

  store.subscribe(updateUI);
  updateUI();
}
