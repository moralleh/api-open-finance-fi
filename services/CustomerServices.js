const mongoose = require("mongoose");
const customerSchema = require("../models/Customer");
const Customer = mongoose.model("Customer",customerSchema);
const AccountServices = require("../services/AccountServices");

class CustomerServices {
    static async findById(customerId) {
        try {
            const customer = await Customer.findById(customerId);
            return customer;
        } catch (error) {
            throw new Error("Erro ao buscar cliente: " + error.message);
        }
    }
    
    static async insertAccInCustomer(customerId, accountId) {
        try{
            const customer = await this.findById(customerId);
            if (!customer) {
                throw new Error("Cliente não encontrado para o ID: " + customerId);
            }
            customer.accounts.push(accountId);
            await customer.save();
            return true;
        }catch(error){
            throw new Error("Erro ao salvar conta em cliente:" + error.message);
        }
    }

    static async saveCustomer(newCustomer) {
        try {
            const customer = new Customer();
            customer.name = newCustomer.name; 
            customer.cpf = newCustomer.cpf;
            customer.email = newCustomer.email;

            await customer.save();
            console.log(customer);
            return true;
        } catch(error){
            throw new Error("Erro interno ao salvar cliente:" + error.message);
        }
    }

    static async getAccounts(customerId) { 
        try{
            const customer = await this.findById(customerId);
            if (!customer) {
                const error = new Error("Cliente não encontrado para o ID: " + customerId);
                error.status = 404;
                throw error;
            }

            const accounts = [];
            for (const accountId of customer.accounts) {
                const account = await AccountServices.findById(accountId);
                if (account) {
                    accounts.push(account);
                }
            }
            return accounts;
        }catch(error){
            if (error.status) throw error;  //Erro por não encontrar id do cliente

            const internalError = new Error("Erro interno ao buscar contas: " + error.message);
            internalError.status = 500;
            throw internalError;
        }
    }

    static async getAll(){
        try{
            const customers = await Customer.find();
            return customers;
        }catch(error){
           throw new Error("Erro interno ao buscar clientes:" + error.message);
        }
    }
}

module.exports = CustomerServices;