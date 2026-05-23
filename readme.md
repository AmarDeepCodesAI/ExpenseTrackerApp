# 💸 Expense Tracker App — Full Stack Expense Management System

![PERN Stack](https://img.shields.io/badge/Stack-PERN-6ee7b7?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

> A modern full-stack expense tracking application built using the **PERN Stack** (PostgreSQL, Express.js, React.js, Node.js).  
Track daily expenses, manage categories, and visualize spending with a clean and responsive UI.

---

## ✨ Features

- ➕ Add new expenses
- ✏️ Edit existing expenses
- 🗑️ Delete expenses
- 📊 Expense statistics dashboard
- 🏷️ Category-based expense tracking
- 📱 Fully responsive UI
- 🔔 Real-time notifications
- ⚡ Fast REST API integration
- 💾 PostgreSQL database support

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, Axios, CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| API | REST API |
| Styling | Custom CSS |

---

## 📁 Project Structure

```bash
ExpenseTrackerApp/
│
├── expense-backend/
│   ├── node_modules/
│   ├── .env
│   ├── .env.example
│   ├── db.js
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── expense-tracker/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
│
├── .gitignore
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

- Node.js (v18 or later)
- PostgreSQL
- Git

---

# 1️⃣ Clone Repository

```bash
git clone https://github.com/AmarDeepCodesAI/ExpenseTrackerApp.git
cd ExpenseTrackerApp
```

---

# 2️⃣ Setup PostgreSQL Database

Open PostgreSQL / pgAdmin and run:

```sql
CREATE DATABASE expense_db;

\c expense_db

CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    amount NUMERIC(10,2),
    category VARCHAR(100),
    date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# 3️⃣ Backend Setup

Move to backend folder:

```bash
cd expense-backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file using `.env.example`

Start backend server:

```bash
node index.js
```

Server will run on:

```bash
http://localhost:5000
```

---

# 4️⃣ Frontend Setup

Open new terminal:

```bash
cd expense-tracker
```

Install dependencies:

```bash
npm install
```

Start frontend:

```bash
npm start
```

Frontend will run on:

```bash
http://localhost:3000
```

---

# 🔌 API Endpoints

Base URL:

```bash
http://localhost:5000
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses` | Get all expenses |
| POST | `/api/expenses` | Add expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |

---

# 📦 Sample Request

## POST `/api/expenses`

```json
{
  "title": "Dinner at Cafe",
  "amount": 850,
  "category": "Food",
  "date": "2026-05-23"
}
```

---

# 📦 Sample Response

```json
{
  "id": 1,
  "title": "Dinner at Cafe",
  "amount": "850.00",
  "category": "Food",
  "date": "2026-05-22T18:30:00.000Z",
  "created_at": "2026-05-23T17:38:29.728Z"
}
```

---

# 🌱 Environment Variables

Create a `.env` file inside `expense-backend`

Example:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=expense_db
DB_PASSWORD=your_password
DB_PORT=5432
PORT=5000
```

---

# 📸 Screenshots

Add screenshots here after running the project locally.

```bash
screenshots/
```

---

# 📌 Future Improvements

- JWT Authentication
- Monthly budget planning
- Expense charts & analytics
- Export reports to PDF/CSV
- Dark mode support

---

# 👨‍💻 Author

## Amar Deep

- GitHub: https://github.com/AmarDeepCodesAI

---

# 📄 License

This project is licensed under the MIT License.