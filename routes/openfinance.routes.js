const express = require("express");
const router = express.Router();

const CustomerController = require("../controllers/OpenFinanceCustomerController");
const ConsentController = require("../controllers/OpenFinanceConsentController");
const InstitutionController = require("../controllers/OpenFinanceInstitutionController");

router.get("/institution", (req, res) => 
    InstitutionController.getInstitutionData(req,res));

router.get("/consents", (req, res) => 
    ConsentController.getAll(req, res));

router.get("/consents/:id", (req, res) => 
    ConsentController.getById(req, res));

router.get("/customers/:id", (req, res) =>
    CustomerController.getById(req, res)
);
router.get("/customers/:id/accounts", (req, res) =>
    CustomerController.getAccounts(req, res)
);

router.get("/accounts/:id/balance", (req, res) =>
    accountController.getBalance(req, res)
);
router.get("/accounts/:id/transactions", (req, res) =>
    accountController.getTransactions(req, res)
);

module.exports = router;