const mongoose = require("mongoose");
const generateID = require("../middlewares/generateID");

const customer = new mongoose.Schema ({
    _id: String,
    name: String,
    cpf: String,
    email: String,
    accounts: [String]
});

customer.pre("save", generateID("cus"));

module.exports = customer;