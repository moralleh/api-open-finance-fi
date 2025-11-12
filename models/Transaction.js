const mongoose = require("mongoose");
const generateID = require("../middlewares/generateID");

const transaction = new mongoose.Schema ({
    _id: String,
   date: Date,
   description: String,
   amount: Number,
   currentInstallment: Number,
   totalInstallments: Number,
   type: String,
   category: String
});

transaction.pre("save", generateID("txn"));

module.exports = transaction;