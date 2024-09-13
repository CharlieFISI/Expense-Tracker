import { addExpense, editExpense, deleteExpense } from "./state/actions.js";
import Expense from "./classes/Expense.js";
import { updateCategoryChart, updateTimelineChart } from "./utils/charts.js";
import { getState, subscribe } from "./state/store.js";

export function initApp() {
  const form = document.getElementById("expenseForm");
  const expenseList = document.getElementById("expenseList");
  const totalExpenses = document.getElementById("totalExpenses");
  const submitBtn = document.getElementById("submitBtn");
  const amountInput = document.getElementById("amount");

  let editingExpenseId = null;

  function updateUI() {
    updateExpenseList();
    updateTotalExpenses();
    updateCharts();
  }

  function updateExpenseList() {
    expenseList.innerHTML = "";
    const state = getState();
    state.expenses.forEach((expense) => {
      const li = document.createElement("li");
      li.className = "expense-list__item";
      li.innerHTML = `
                <div>
                    <span class="expense-list__description">${
                      expense.description
                    }</span>
                    <span class="expense-list__category">${
                      expense.category
                    }</span>
                    <span class="expense-list__date">${expense.date}</span>
                </div>
                <span class="expense-list__amount">${formatAmount(
                  expense.amount
                )}</span>
                <div class="expense-list__actions">
                    <button class="expense-list__edit-btn" data-id="${
                      expense.id
                    }">Editar</button>
                    <button class="expense-list__delete-btn" data-id="${
                      expense.id
                    }">Eliminar</button>
                </div>
            `;
      expenseList.appendChild(li);
    });
  }

  function updateTotalExpenses() {
    const total = getTotalExpenses();
    totalExpenses.textContent = formatAmount(total);
  }

  function getTotalExpenses() {
    return getState().expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
  }

  function updateCharts() {
    updateCategoryChart();
    updateTimelineChart();
  }

  function formatAmount(amount) {
    return `S/ ${amount.toLocaleString("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  function parseAmount(amountString) {
    return parseFloat(amountString.replace(/[^\d.]/g, ""));
  }

  function formatInputAmount(value) {
    // Remove any non-digit characters except the last dot
    value = value.replace(/[^\d.]/g, "").replace(/\.(?=.*\.)/g, "");

    // Split the input into integer and decimal parts
    let [integerPart, decimalPart] = value.split(".");

    // Add thousands separators to the integer part
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // If there's a decimal part, limit it to 2 digits
    if (decimalPart !== undefined) {
      decimalPart = decimalPart.slice(0, 2);
      return `${integerPart}.${decimalPart}`;
    } else if (value.endsWith(".")) {
      return `${integerPart}.`;
    } else {
      return integerPart;
    }
  }

  amountInput.addEventListener("input", function (e) {
    const cursorPosition = e.target.selectionStart;
    const originalValue = e.target.value;
    const formattedValue = formatInputAmount(originalValue);

    if (formattedValue !== originalValue) {
      e.target.value = formattedValue;
      const cursorOffset = formattedValue.length - originalValue.length;
      e.target.setSelectionRange(
        cursorPosition + cursorOffset,
        cursorPosition + cursorOffset
      );
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const amount = parseAmount(amountInput.value);
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
      await editExpense(editedExpense);
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
      await addExpense(newExpense);
    }

    updateUI();
    form.reset();
  });

  expenseList.addEventListener("click", async (e) => {
    if (e.target.classList.contains("expense-list__edit-btn")) {
      const expenseId = parseInt(e.target.getAttribute("data-id"));
      const expenseToEdit = getState().expenses.find(
        (expense) => expense.id === expenseId
      );
      if (expenseToEdit) {
        document.getElementById("expenseId").value = expenseToEdit.id;
        amountInput.value = formatInputAmount(expenseToEdit.amount.toString());
        document.getElementById("description").value =
          expenseToEdit.description;
        document.getElementById("date").value = expenseToEdit.date;
        document.getElementById("category").value = expenseToEdit.category;
        submitBtn.textContent = "Actualizar Gasto";
        editingExpenseId = expenseId;
      }
    } else if (e.target.classList.contains("expense-list__delete-btn")) {
      const expenseId = parseInt(e.target.getAttribute("data-id"));
      await deleteExpense(expenseId);
      updateUI();
    }
  });

  subscribe(updateUI);
  updateUI();
}
