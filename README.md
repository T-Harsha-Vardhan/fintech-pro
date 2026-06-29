# 💰 FinTrack Pro

A clean and responsive personal finance tracker built with **HTML, CSS, and Vanilla JavaScript**. It helps users manage their income and expenses, visualize cash flow, and maintain separate accounts using browser storage without relying on a backend.

---

## ✨ Features

- 🔐 Multi-user authentication (Frontend only)
- 📝 Register and login system
- 👤 Persistent user sessions
- 💵 Add and delete transactions
- 📊 Weekly cash flow chart using Chart.js
- 💰 Automatic balance, income, and expense calculations
- 🔍 Filter transactions by All, Income, or Expense
- ⚙️ User-specific settings
  - Display name
  - Currency selection
  - Dark mode
- 💾 Persistent data using Local Storage
- 👥 Separate transactions and settings for every user
- 📱 Fully responsive layout

---

## 🛠️ Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Chart.js
- Local Storage API

---

## 📂 Project Structure

```
FinTrack-Pro/
│
├── index.html          # Login Page
├── register.html       # Register Page
├── dashboard.html      # Main Dashboard
│
├── auth.css
├── style.css
│
├── auth.js
├── script.js
│
└── README.md
```

---

## 🚀 Getting Started

Clone the repository

```bash
git clone https://github.com/yourusername/fintrack-pro.git
```

Move into the project folder

```bash
cd fintrack-pro
```

Open the project

```bash
Open index.html
```

or use the VS Code Live Server extension.

---

## 🔑 Authentication

This project uses a simple frontend-only authentication system.

- Register a new account
- Login with your credentials
- Session is stored in Local Storage
- Dashboard access is protected
- Logout clears the active session

> No backend or database is used.

---

## 📦 Local Storage Structure

```text
fintrack_users
current_user

transactions_<userId>

settings_<userId>
```

Example

```text
fintrack_users

[
   {
      id: "...",
      name: "Harsha",
      email: "harsha@gmail.com",
      password: "******"
   }
]

current_user

"ab12cd34"

transactions_ab12cd34

[...]

settings_ab12cd34

{
   currency: "₹",
   darkMode: false
}
```

Each registered user has their own transactions and settings.

---

## 🎯 What I Learned

Building this project helped me gain practical experience with:

- DOM Manipulation
- Event Handling
- Modular JavaScript
- Local Storage
- Authentication Flow
- Session Management
- Data Persistence
- Dynamic UI Rendering
- Chart Integration
- State Management without Frameworks

---

## 💡 Challenges & Solutions

During development, I wanted multiple users to have independent data while using only Local Storage.

Instead of storing everything under a single key, I designed a user-based storage structure where each account has its own transactions and settings. This allowed the application to simulate how a backend would separate user data while remaining a frontend-only project.

---

## 🔮 Future Improvements

- Edit transactions
- Transaction search
- Budget planning
- Monthly analytics
- Export to CSV/PDF
- Profile picture
- Password hashing
- Backend authentication
- Cloud database integration
- Recurring transactions

---

## 👨‍💻 Author

**Harsha**

If you have suggestions or feedback, feel free to open an issue or connect with me.

---

## 📄 License

This project is open source and available under the MIT License.
