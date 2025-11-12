const express = require("express");
const router = express.Router();

const HomeController = require("../controllers/HomeController");
const CustomerController = require("../controllers/CustomerController");
const AccountController = require("../controllers/AccountController");
const TransactionController = require("../controllers/TransactionController");
const ConsentController = require("../controllers/OpenFinanceConsentController");

router.get("/", HomeController.index);

router.post("/openfinance/consents", (req, res) => ConsentController.create(req, res));
router.delete("/openfinance/consents/:id", (req, res) => ConsentController.revoke(req, res));

router.post("/customers", (req, res) => CustomerController.create(req, res));

router.post("/accounts", (req, res) => AccountController.create(req, res));
router.get("/accounts/:id/balance", (req, res) => AccountController.showBalance(req, res));

router.post("/transactions", (req, res) => TransactionController.create(req, res));
router.get("/transaction/:idAcc", (req, res) => TransactionController.showTransactions(req, res));

module.exports = router;