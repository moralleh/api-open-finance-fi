const mongoose = require("mongoose");
const transaction = require("./Transaction");
const generateID = require("../middlewares/generateID");
const generateNumber = require("../middlewares/generateNumber");

const account = new mongoose.Schema ({
    _id: String,
    type: String,
    branch: String,
    number: String,
    balance: Number,
    creditCardLimit: Number,
    availableLimit: Number,
    transactions: [transaction]
})

account.pre("save", generateID("acc"));
account.pre("save", generateNumber());

account.pre("save", function (next) {
  if (this.type !== "credit-card") {
    this.creditCardLimit = undefined;
    this.availableLimit = undefined;
  }
  next();
});

module.exports = account;