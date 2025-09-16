const express = require("express");
const app = express();
const router = express.Router();

const HomeController = require("../controllers/HomeController");
const CustomerController = require("../controllers/CustomerController");
const AccountController = require("../controllers/AccountController");
const TransactionController = require("../controllers/TransactionController");

router.get("/", HomeController.index);
router.post("/customer", CustomerController.create);
router.post("/account", AccountController.create);
router.get("/account/:id", AccountController.showBalance);
router.post("/transaction", TransactionController.create);
router.get("/transaction/:idAcc", TransactionController.showTransactions);

module.exports = router;