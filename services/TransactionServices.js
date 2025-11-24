const mongoose = require("mongoose");
const transactionSchema = require("../models/Transaction");
const Transaction = mongoose.model("Transaction", transactionSchema); 

class TransactionServices{
    static async findById(id){
        try {
            const transaction = await Transaction.findById(id);
            return transaction;
        } catch (error) {
            throw error("Erro ao buscar transação: " + error.message);
        }
    }
    
    static async checkLimit(value, amount) {
        if (amount > value) return true;
        return false;
    }

    static async saveTransaction(newTransaction){
        try {
            const transaction = new Transaction();
            transaction.date = newTransaction.date;
            transaction.description = newTransaction.description;
            transaction.amount = newTransaction.amount;
            transaction.type = newTransaction.type;
            transaction.category = newTransaction.category;
            transaction.totalInstallments = newTransaction.totalInstallments;
            transaction.currentInstallment = newTransaction.currentIntallment;
        
            await transaction.save();
            console.log(transaction);
            return transaction._id;
        }catch(error){
            throw new Error("Erro interno ao realizar transação:" + error.message);
        }
    }

    static async getAll(){
        try{
            const transactions = await Transaction.find();
            return transactions;
        }catch(error){
            throw new Error("Erro interno ao buscar transações:" + error.message);
        }
    }
   
}

module.exports = TransactionServices;