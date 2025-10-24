const customerSchema = require("../models/Customer");
const mongoose = require("mongoose");
const Customer = mongoose.model("Customer", customerSchema);

async function checkDuplicateCPF(cpf) {
    const customer = await Customer.findOne({ cpf });
    return !!customer;
}

function validateCPF(cpf) {
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    const calculateDigit = (cpf, factor) => {
        let total = 0;
        for (let i = 0; i < factor - 1; i++) {
            total += parseInt(cpf[i]) * (factor - i);
        }
        const remainder = total % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    };

    if (calculateDigit(cpf, 10) !== parseInt(cpf[9])) return false;
    if (calculateDigit(cpf, 11) !== parseInt(cpf[10])) return false;

    return true;
}

module.exports = { checkDuplicateCPF, validateCPF };
