const dashboardLink = document.querySelector(".nav-links li:first-child a");
const settingsLink = document.querySelector(".nav-links li:last-child a");

const dashboardSection = document.querySelector(".dashboard-section");
const settingsSection = document.querySelector(".settings-section");

const logo = document.querySelector(".logo");

const addTransactionBtn = document.querySelector(".add-transaction-btn");
const logoutBtn = document.querySelector(".logout-btn");

const currentBalanceAmount = document.querySelector(".current-balance-amount");

const totalIncomeAmount = document.querySelector(".total-income-amount");

const totalExpenseAmount = document.querySelector(".total-expense-amount");

const totalTransactionAmount = document.querySelector(
  ".total-transaction-amount",
);

const chartCanvas = document.getElementById("cash-flow-chart-canvas");

const transactionTableBody = document.querySelector(".transaction-table-body");

const filterBtns = document.querySelectorAll(".filter-btn");

const profileNameInput = document.querySelector("#profile-name");

const currencySelect = document.querySelector("#currency");

const darkModeToggle = document.querySelector("#dark-mode");

const resetBtn = document.querySelector(".reset-btn");

const modalOverlay = document.querySelector(".transaction-modal-overlay");

const modal = document.querySelector(".transaction-modal");

const closeModalBtn = document.querySelector(".close-modal-btn");

const cancelBtn = document.querySelector(".cancel-btn");

const saveTransactionBtn = document.querySelector(".save-transaction-btn");

const transactionType = document.querySelector(".transaction-type");

const transactionDescription = document.querySelector(
  ".transaction-description",
);

const transactionAmount = document.querySelector(".transaction-amount");

const transactionDate = document.querySelector(".transaction-date");

const transactionCategory = document.querySelector(".transaction-category");

let transactions = [];

let activeFilter = "all";

let cashFlowChart = null;

let profile = {
  currency: "₹",
  darkMode: false,
};

const USERS_STORAGE_KEY = "fintrack_users";
const CURRENT_USER_KEY = "current_user";
let TRANSACTIONS_STORAGE_KEY = "";
let SETTINGS_STORAGE_KEY = "";

const chartLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

let incomeData = [0, 0, 0, 0, 0, 0, 0];
let expenseData = [0, 0, 0, 0, 0, 0, 0];

const currentUserId = localStorage.getItem(CURRENT_USER_KEY);

if (!currentUserId) {
  window.location.href = "index.html";
}

const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];

const currentUser = users.find((user) => {
  return user.id === currentUserId;
});

if (!currentUser) {
  localStorage.removeItem(CURRENT_USER_KEY);

  window.location.href = "index.html";
}

logo.textContent = `FinTrack Pro • ${currentUser.name}`;

TRANSACTIONS_STORAGE_KEY = `transactions_${currentUser.id}`;

SETTINGS_STORAGE_KEY = `settings_${currentUser.id}`;

function initializeApp() {
  loadTransactions();

  loadSettings();

  renderChart();

  showDashboard();

  refreshDashboard();

  registerEventListeners();
}

function registerEventListeners() {
  dashboardLink.addEventListener("click", handleDashboardPage);

  settingsLink.addEventListener("click", handleSettingsPage);

  addTransactionBtn.addEventListener("click", openModal);

  closeModalBtn.addEventListener("click", closeModal);

  cancelBtn.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", closeModalOnOverlay);

  document.addEventListener("keydown", closeModalOnEscape);

  saveTransactionBtn.addEventListener("click", addTransaction);

  filterBtns.forEach((button) => {
    button.addEventListener("click", handleFilter);
  });

  profileNameInput.addEventListener("change", saveSettings);

  currencySelect.addEventListener("change", changeCurrency);

  darkModeToggle.addEventListener("change", toggleDarkMode);

  resetBtn.addEventListener("click", resetApplication);

  logoutBtn.addEventListener("click", logoutApplication);
}

function renderChart() {
  if (cashFlowChart) {
    return;
  }

  cashFlowChart = new Chart(chartCanvas, {
    type: "bar",

    data: {
      labels: chartLabels,

      datasets: [
        {
          label: "Income",

          data: incomeData,

          backgroundColor: "#48a868",

          borderRadius: 8,

          borderSkipped: false,
        },

        {
          label: "Expense",

          data: expenseData,

          backgroundColor: "#d36a6a",

          borderRadius: 8,

          borderSkipped: false,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      animation: false,

      plugins: {
        legend: {
          position: "top",

          align: "end",
        },
      },

      interaction: {
        mode: "index",

        intersect: false,
      },

      scales: {
        x: {
          grid: {
            display: false,
          },
        },

        y: {
          beginAtZero: true,

          grid: {
            color: "#e5e7eb",
          },
        },
      },
    },
  });
}

function handleDashboardPage(event) {
  event.preventDefault();

  showDashboard();
}

function handleSettingsPage(event) {
  event.preventDefault();

  showSettings();
}

function showDashboard() {
  dashboardSection.style.display = "flex";

  settingsSection.style.display = "none";

  dashboardLink.parentElement.classList.add("active-nav-link");

  settingsLink.parentElement.classList.remove("active-nav-link");
}

function showSettings() {
  dashboardSection.style.display = "none";

  settingsSection.style.display = "block";

  settingsLink.parentElement.classList.add("active-nav-link");

  dashboardLink.parentElement.classList.remove("active-nav-link");
}

function openModal() {
  modalOverlay.classList.add("show");

  transactionDescription.focus();
}

function closeModal() {
  modalOverlay.classList.remove("show");

  resetTransactionForm();
}

function closeModalOnOverlay(event) {
  if (event.target !== modalOverlay) {
    return;
  }

  closeModal();
}

function closeModalOnEscape(event) {
  if (event.key !== "Escape") {
    return;
  }

  closeModal();
}

function resetTransactionForm() {
  transactionType.value = "Income";

  transactionDescription.value = "";

  transactionAmount.value = "";

  transactionDate.value = "";

  transactionCategory.selectedIndex = 0;
}

function loadTransactions() {
  const savedTransactions = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);

  if (!savedTransactions) {
    transactions = [];

    return;
  }

  transactions = JSON.parse(savedTransactions);
}

function saveTransactions() {
  localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
}

function loadSettings() {
  const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

  if (!savedSettings) {
    return;
  }

  profile = JSON.parse(savedSettings);

  profileNameInput.value = currentUser.name;

  currencySelect.value = profile.currency;

  darkModeToggle.checked = profile.darkMode;

  if (profile.darkMode) {
    document.body.classList.add("dark-theme");
  }

  document.querySelectorAll(".info-card-currency").forEach((el) => {
    el.textContent = " " + profile.currency + " ";
  });
}

function saveSettings() {
  const newName = profileNameInput.value.trim();

  currentUser.name = newName;

  logo.textContent = `FinTrack Pro • ${currentUser.name}`;

  profile.currency = currencySelect.value;
  profile.darkMode = darkModeToggle.checked;

  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(profile));
}

function validateTransaction() {
  const description = transactionDescription.value.trim();

  const amount = Number(transactionAmount.value);

  const date = transactionDate.value;

  const category = transactionCategory.value;

  if (description === "") {
    alert("Please enter a description.");

    transactionDescription.focus();

    return false;
  }

  if (!amount || amount <= 0 || Number.isNaN(amount)) {
    alert("Please enter a valid amount.");

    transactionAmount.focus();

    return false;
  }

  if (date === "") {
    alert("Please select a transaction date.");

    transactionDate.focus();

    return false;
  }

  if (category === "") {
    alert("Please select a category.");

    transactionCategory.focus();

    return false;
  }

  return true;
}

function generateTransactionId() {
  return crypto.randomUUID();
}

function addTransaction() {
  const isValid = validateTransaction();

  if (!isValid) {
    return;
  }

  const transaction = {
    id: generateTransactionId(),

    type: transactionType.value,

    description: transactionDescription.value.trim(),

    amount: Number(transactionAmount.value),

    date: transactionDate.value,

    category: transactionCategory.value,
  };

  transactions.push(transaction);

  saveTransactions();

  closeModal();

  refreshDashboard();
}

function deleteTransaction(transactionId) {
  const isConfirmed = confirm("Delete this transaction?");

  if (!isConfirmed) {
    return;
  }

  transactions = transactions.filter((transaction) => {
    return transaction.id !== transactionId;
  });

  saveTransactions();

  refreshDashboard();
}

function getFilteredTransactions() {
  if (activeFilter === "income") {
    return transactions.filter((transaction) => {
      return transaction.type === "Income";
    });
  }

  if (activeFilter === "expense") {
    return transactions.filter((transaction) => {
      return transaction.type === "Expense";
    });
  }

  return transactions;
}

function formatCurrency(amount) {
  return amount.toLocaleString("en-IN");
}

function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function calculateTotals() {
  let balance = 0;

  let income = 0;

  let expense = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === "Income") {
      income += transaction.amount;
    } else {
      expense += transaction.amount;
    }
  });

  balance = income - expense;

  return {
    balance,
    income,
    expense,
    transactions: transactions.length,
  };
}

function renderCards() {
  const totals = calculateTotals();

  currentBalanceAmount.textContent = formatCurrency(totals.balance);

  totalIncomeAmount.textContent = formatCurrency(totals.income);

  totalExpenseAmount.textContent = formatCurrency(totals.expense);

  totalTransactionAmount.textContent = totals.transactions;
}

function renderTransactions() {
  const filteredTransactions = getFilteredTransactions();

  transactionTableBody.innerHTML = "";

  if (filteredTransactions.length === 0) {
    renderEmptyState();

    return;
  }

  filteredTransactions.forEach((transaction) => {
    const transactionRow = document.createElement("tr");

    transactionRow.innerHTML = `
        <td>${formatDate(transaction.date)}</td>

        <td>${transaction.description}</td>

        <td>${transaction.category}</td>

        <td class = "${transaction.type === "Income" ? "income" : "expense"}">
            ${profile.currency}${formatCurrency(transaction.amount)}
        </td>

        <td>
            <button
                class = "delete-btn"
                data-id = "${transaction.id}"
            >
                Delete
            </button>
        </td>
    `;

    transactionTableBody.appendChild(transactionRow);
  });
}

function renderEmptyState() {
  transactionTableBody.innerHTML = `
        <tr>

            <td
                colspan = "5"
                class = "empty-message"
            >
                No transactions found.
            </td>

        </tr>
    `;
}

function handleDeleteTransaction(event) {
  if (!event.target.classList.contains("delete-btn")) {
    return;
  }

  deleteTransaction(event.target.dataset.id);
}

transactionTableBody.addEventListener("click", handleDeleteTransaction);

function updateChart() {
  incomeData = [0, 0, 0, 0, 0, 0, 0];
  expenseData = [0, 0, 0, 0, 0, 0, 0];

  transactions.forEach((transaction) => {
    const day = new Date(transaction.date + "T00:00:00").getDay();

    const chartIndex = day === 0 ? 6 : day - 1;

    if (transaction.type === "Income") {
      incomeData[chartIndex] += transaction.amount;
    } else {
      expenseData[chartIndex] += transaction.amount;
    }
  });

  cashFlowChart.data.datasets[0].data = [...incomeData];

  cashFlowChart.data.datasets[1].data = [...expenseData];

  cashFlowChart.update();
}

function handleFilter(event) {
  filterBtns.forEach((button) => {
    button.classList.remove("active");
  });

  event.target.classList.add("active");

  const filterValue = event.target.textContent.trim().toLowerCase();

  if (filterValue === "all") {
    activeFilter = "all";
  }

  if (filterValue === "income") {
    activeFilter = "income";
  }

  if (filterValue === "expense") {
    activeFilter = "expense";
  }

  refreshDashboard();
}

function changeCurrency() {
  document.querySelectorAll(".info-card-currency").forEach((currency) => {
    currency.textContent = " " + currencySelect.value + " ";
  });

  saveSettings();

  renderCards();

  renderTransactions();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-theme", darkModeToggle.checked);

  saveSettings();
}

function resetApplication() {
  const isConfirmed = confirm("Are you sure you want to reset all data?");

  if (!isConfirmed) {
    return;
  }

  transactions = [];

  profile = {
    name: "",
    currency: "₹",
    darkMode: false,
  };

  localStorage.removeItem(TRANSACTIONS_STORAGE_KEY);

  localStorage.removeItem(SETTINGS_STORAGE_KEY);

  profileNameInput.value = "";

  currencySelect.value = "₹";

  darkModeToggle.checked = false;

  document.body.classList.remove("dark-theme");

  document.querySelectorAll(".info-card-currency").forEach((el) => {
    el.textContent = " ₹ ";
  });

  activeFilter = "all";

  filterBtns.forEach((button) => {
    button.classList.remove("active");

    if (button.textContent.trim().toLowerCase() === "all") {
      button.classList.add("active");
    }
  });

  refreshDashboard();
}

function logoutApplication() {
  const isConfirmed = confirm("Do you want to logout?");

  if (!isConfirmed) {
    return;
  }

  localStorage.removeItem(CURRENT_USER_KEY);

  window.location.href = "index.html";
}

function refreshDashboard() {
  renderCards();

  renderTransactions();

  updateChart();
}

initializeApp();
