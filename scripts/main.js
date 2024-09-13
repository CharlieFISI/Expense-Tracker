import { initApp } from "./app.js";
import { initDB } from "./utils/db.js";
import { loadExpenses } from "./state/actions.js";

async function init() {
  await initDB();
  await loadExpenses();
  initApp();
}

init();
