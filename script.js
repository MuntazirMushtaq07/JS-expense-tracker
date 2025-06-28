// ===============================
// 📊 Expense Tracker App
// -------------------------------
// ➤ Tracks income and expenses
// ➤ Updates total balance in real-time
// ➤ Saves transactions to localStorage
// ➤ Allows JSON and CSV export of transaction history
// ===============================

// ✅ Get DOM Elements
let descInput = document.getElementById("descInput");         // Input for transaction description
let amountInput = document.getElementById("amountInput");     // Input for amount
let typeInput = document.getElementById("typeInput");         // Dropdown: 'income' or 'expense'
let addBtn = document.getElementById("addBtn");               // Button to add new transaction

let balance = document.getElementById("balance");             // Display total balance
let income = document.getElementById("income");               // Display total income
let expense = document.getElementById("expense");             // Display total expenses
let transactionList = document.getElementById("transactionList"); // Display list of all transactions

let exportJSONBtn = document.getElementById("exportJSON");    // Button to export data to JSON
let exportCSVBtn = document.getElementById("exportCSV");      // Button to export data to CSV

// ✅ Bind export buttons to their functions
exportJSONBtn.addEventListener("click", exportToJSON);
exportCSVBtn.addEventListener("click", exportToCSV);

// ✅ Transactions Array - Load from localStorage or empty array
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// ===============================
// ✅ ADD TRANSACTION
// -------------------------------
// Triggered when user clicks "Add Transaction"
// Validates inputs, creates a new transaction object,
// saves it, updates UI and localStorage
// ===============================
addBtn.addEventListener("click", function () {
  let desc = descInput.value.trim();
  let amount = parseFloat(amountInput.value);
  let type = typeInput.value;

  // Basic input validation
  if (desc === "" || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid description and a positive amount.");
    return;
  }

  // Create new transaction object
  let transaction = {
    id: Date.now(),         // Unique ID using timestamp
    description: desc,
    amount: amount,
    type: type              // 'income' or 'expense'
  };

  // Add transaction to array
  transactions.push(transaction);

  // Save and refresh display
  saveToLocalStorage();
  renderTransactions();
  updateUI();

  // Clear input fields
  descInput.value = "";
  amountInput.value = "";
});

// ===============================
// ✅ RENDER TRANSACTIONS
// -------------------------------
// Loops through the transactions array and displays
// each item in the HTML list with delete button
// ===============================
function renderTransactions() {
  transactionList.innerHTML = ""; // Clear existing list

  transactions.forEach((txn) => {
    let li = document.createElement("li");

    // Show transaction details and delete button
    li.innerHTML = `
      ${txn.description} 
      ${txn.type === "income" ? "+" : "-"} ₹${txn.amount}
      <button onclick="deleteTransaction(${txn.id})">🗑</button>
    `;

    li.classList.add(txn.type); // Add 'income' or 'expense' class for color
    transactionList.appendChild(li);
  });
}

// ===============================
// ✅ DELETE TRANSACTION
// -------------------------------
// Removes a transaction from the array based on ID
// Then updates localStorage and UI
// ===============================
function deleteTransaction(id) {
  transactions = transactions.filter(txn => txn.id !== id);
  saveToLocalStorage();
  renderTransactions();
  updateUI();
}

// ===============================
// ✅ UPDATE UI TOTALS
// -------------------------------
// Calculates total income, expenses, and balance
// Updates the DOM values
// ===============================
function updateUI() {
  let incomeAmount = transactions
    .filter(txn => txn.type === "income")
    .reduce((acc, txn) => acc + txn.amount, 0);

  let expenseAmount = transactions
    .filter(txn => txn.type === "expense")
    .reduce((acc, txn) => acc + txn.amount, 0);

  income.innerText = incomeAmount;
  expense.innerText = expenseAmount;
  balance.innerText = incomeAmount - expenseAmount;
}

// ===============================
// ✅ SAVE TO LOCALSTORAGE
// -------------------------------
// Saves the transactions array to localStorage
// for data persistence between sessions
// ===============================
function saveToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// ===============================
// ✅ EXPORT TO JSON
// -------------------------------
// Creates and downloads a JSON file of all transactions
// ===============================
function exportToJSON() {
  let dataStr = JSON.stringify(transactions, null, 2); // Indented JSON
  let blob = new Blob([dataStr], { type: "application/json" });
  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.href = url;
  a.download = "transactions.json";
  a.click();

  URL.revokeObjectURL(url); // Clean up
}

// ===============================
// ✅ EXPORT TO CSV
// -------------------------------
// Creates and downloads a CSV file of all transactions
// ===============================
function exportToCSV() {
  if (transactions.length === 0) return;

  let csv = "Description,Amount,Type\n"; // CSV Header

  transactions.forEach(txn => {
    csv += `${txn.description},${txn.amount},${txn.type}\n`;
  });

  let blob = new Blob([csv], { type: "text/csv" });
  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();

  URL.revokeObjectURL(url); // Clean up
}

// ✅ Initial Page Load
renderTransactions();
updateUI();
