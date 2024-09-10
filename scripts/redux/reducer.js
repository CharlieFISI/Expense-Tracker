function expenseReducer(state, action) {
  switch (action.type) {
    case "ADD_EXPENSE":
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
        categories: {
          ...state.categories,
          [action.payload.category]: {
            ...state.categories[action.payload.category],
            expenses: [
              ...state.categories[action.payload.category].expenses,
              action.payload,
            ],
          },
        },
      };
    case "EDIT_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id ? action.payload : expense
        ),
        categories: Object.fromEntries(
          Object.entries(state.categories).map(([categoryName, category]) => [
            categoryName,
            {
              ...category,
              expenses: category.expenses.map((expense) =>
                expense.id === action.payload.id ? action.payload : expense
              ),
            },
          ])
        ),
      };
    case "DELETE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.filter(
          (expense) => expense.id !== action.payload
        ),
        categories: Object.fromEntries(
          Object.entries(state.categories).map(([categoryName, category]) => [
            categoryName,
            {
              ...category,
              expenses: category.expenses.filter(
                (expense) => expense.id !== action.payload
              ),
            },
          ])
        ),
      };
    case "LOAD_EXPENSES":
      return action.payload;
    default:
      return state;
  }
}

export default expenseReducer;
