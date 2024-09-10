class Category {
  constructor(name, expenses = []) {
    this.name = name;
    this.expenses = expenses;
  }

  addExpense(expense) {
    this.expenses.push(expense);
  }

  getTotalAmount() {
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }
}

export default Category;
