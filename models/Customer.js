const mongoose = require("mongoose");
const account = require("./Account");
const generateID = require("../middlewares/generateID");

const customer = new mongoose.Schema ({
    _id: String,
    name: String,
    cpf: String,
    email: String,
    accounts: [account]
})

customer.pre("save", generateID("cus"));

module.exports = customer;