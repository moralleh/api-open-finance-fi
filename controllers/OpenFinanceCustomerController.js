const customerSchema = require("../models/Customer");
const mongoose = require("mongoose");
const Customer = mongoose.model("Customer", customerSchema);
const CustomerController = require("./CustomerController");

class OpenFinanceCustomerController {

    static async getById(req,res){
        try {        
            const customer = await CustomerController.findById(req.params.id);
            if (!customer) {
                return res.status(404).json({ error: "Cliente não encontrado" });
            }

            const { _id, name, cpf } = customer;
            res.json({ _id, name, cpf });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }        
    }

    static async getAccounts(req,res){

    }



}



module.exports = OpenFinanceCustomerController;