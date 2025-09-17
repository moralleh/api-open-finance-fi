# API Simulator - Financial Institution

This is an API that simulates a financial institution (FI).  
It was developed as part of a project during my current internship at **Compass UOL**.

### Table of Contents

- [1. Architecture](#architecture)
- [2. Features](#features)
- [3. Technologies](#technologies-used)
- [4. Endpoints](#endpoints)
- [5. Request Examples](#request-examples)

<a id="architecture"></a>
## 📂 1. Architecture

```
open-finance-bank/
│
├─ controllers/           # Route control logic and data manipulation
│   ├─ AccountController.js
│   ├─ CustomerController.js
│   ├─ HomeController.js
│   └─ TransactionController.js
│
├─ middlewares/           # Intermediate Functions
│   ├─ generateID.js
│   └─ generateNumber.js
│
├─ models/                # Definition of system models/entities
│   ├─ Account.js
│   ├─ Customer.js
│   └─ Transaction.js
│
├─ routes/                # Defining application routes
│   └─ routes.js
│
├─ index.js               # Server main file

```

<a id="features"></a>
## ⚙️ 2. Features

- Customer creation with CPF validation,
- Account creation,
- Viewing account balances and transaction history,
- Performing credit and debit transactions.

<a id="technologies-used"></a>
## 🛠️ 3. Technologies Used

- Node.js
- Express
- MongoDB

<a id="endpoints"></a>
## 🌐 4. Endpoints

### Customers
- POST **/customer** - Create new customer.

### Accounts
- POST **/account** - Create new account.
- **GET /account/:id** - Display the current balance of the account by its ID.

### Transactions
- POST **/transaction** - Create new transaction.
- GET **/transaction/:idAcc** - Display all transactions associated with a specific account ID.

<a>id="request-examples"</a>
## 🗂️ 5. Request Examples

### Customer

```
{
  _id: "cus_001",
  name: "Ricardo Rocha",
  cpf: "72064702032",
  email: "ricardo.rocha@gmail.com",
  accounts: []
}
```

### Account

```
{
  _id: "acc_001",
  type: "checking",
  branch: "0001",
  number: "00123-2",
  balance: 1000.00,
  transactions: []
}
```

### Transaction

```
{
  _id: "txn_001",
  date: '2025-09-16T14:23:07.099Z',
  description: "Deposit via wire transfer",
  amount: 1000.00,
  type: "credit",
}
```
