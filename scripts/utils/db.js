const DB_NAME = "ExpenseTrackerDB";
const DB_VERSION = 1;
const STORE_NAME = "expenses";

let db;

export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      reject("Error opening database");
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      const objectStore = db.createObjectStore(STORE_NAME, { keyPath: "id" });
      objectStore.createIndex("category", "category", { unique: false });
      objectStore.createIndex("date", "date", { unique: false });
    };
  });
}

export function addExpense(expense) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(expense);

    request.onerror = (event) => {
      reject("Error adding expense");
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
}

export function getAllExpenses() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = (event) => {
      reject("Error getting expenses");
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
}

export function updateExpense(expense) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(expense);

    request.onerror = (event) => {
      reject("Error updating expense");
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
}

export function deleteExpense(id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onerror = (event) => {
      reject("Error deleting expense");
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
}
