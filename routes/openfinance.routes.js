const express = require("express");
const router = express.Router();

const InstitutionController = require("../controllers/OpenFinanceInstitutionController");
const ConsentController = require("../controllers/OpenFinanceConsentController");

const CustomerController = require("../controllers/OpenFinanceCustomerController");
const AccountController = require("../controllers/OpenFinanceAccountController");

// Rotas de Instituição

router.get("/institution", (req, res) => 
    InstitutionController.getInstitutionData(req,res));

// Rotas de Consentimentos

router.get("/consents", (req, res) => 
    ConsentController.getAll(req, res));

router.get("/consents/:id", (req, res) => 
    ConsentController.getById(req, res));

// Rotas de Clientes

router.get("/customers/:id", (req, res) =>
    CustomerController.getById(req, res)
);
router.get("/customers/:id/accounts", (req, res) =>
    CustomerController.getAccounts(req, res)
);

// Rotas de Contas e Transações

router.get("/accounts/:id/balance", (req, res) =>
    AccountController.getBalance(req, res)
);
router.get("/accounts/:id/transactions", (req, res) =>
    AccountController.getTransactions(req, res)
);

module.exports = router;