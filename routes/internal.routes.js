const express = require("express");
const router = express.Router();

const HomeController = require("../controllers/HomeController");
const CustomerController = require("../controllers/CustomerController");
const AccountController = require("../controllers/AccountController");
const TransactionController = require("../controllers/TransactionController");

const ConsentController = require("../controllers/OpenFinanceConsentController");

router.get("/", HomeController.index);

// Rotas de Gerenciamento de Consentimento (acesso interno)
router.post("/consents", (req, res) => 
    ConsentController.create(req, res));

router.delete("/consents/:id", (req, res) => 
    ConsentController.revoke(req, res));

// Rotas de clientes
router.post("/customers", (req, res) => 
    CustomerController.create(req, res));

router.get("/customers", (req, res) => 
    CustomerController.getAll(req, res));

router.get("/customers/:id", (req, res) =>
    CustomerController.getById(req, res)
);
router.get("/customers/:id/accounts", (req, res) =>
    CustomerController.getAccounts(req, res)
);

// Rotas de Contas

router.post("/accounts", (req, res) => 
    AccountController.create(req, res));

router.get("/accounts", (req, res) => 
    AccountController.getAll(req, res));

router.get("/accounts/:id/balance", (req, res) =>
    AccountController.getBalance(req, res)
);
router.get("/accounts/:id/transactions", (req, res) =>
    AccountController.getTransactions(req, res)
);

// Rota de Transação

router.post("/transactions", (req, res) => 
    TransactionController.create(req, res));

router.get("/transactions", (req, res) => 
    TransactionController.getAll(req, res));

module.exports = router;
