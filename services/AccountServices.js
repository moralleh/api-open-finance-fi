const mongoose = require("mongoose");
const accountSchema = require("../models/Account");
const Account = mongoose.model("Account", accountSchema);
const TransactionServices = require("../services/TransactionServices");

class AccountServices {
    static async findById(idAccount) {
        try {
            const account = await Account.findById(idAccount);
            return account;
        } catch (error) {
            throw new Error("Erro ao buscar conta: " + error.message);
        }
    }

    static async getBalance(idAccount) { 
        try{
            const account = await this.findById(idAccount);
            if (!account) {
                const error = new Error("Conta não encontrada para o ID: " + idAccount);
                error.status = 404;
                throw error; 
            }
            return account.balance;
            
        }catch(error){
            if (error.status) throw error;  //Erro por não encontrar id da conta

            const internalError = new Error("Erro interno ao buscar o saldo: " + error.message);
            internalError.status = 500;
            throw internalError;
        }
    }

    static async saveAccount(newAccount){
        try {
            const account = new Account();
            account.type = newAccount.type;
            account.branch = newAccount.branch;
            account.balance = newAccount.balance;
            account.creditCardLimit = newAccount.creditCardLimit;
            account.availableLimit = newAccount.availableLimit;

            await account.save();
            console.log(account);
            return account._id;
        } catch(error) {
            throw new Error("Erro interno ao salvar conta:" + error.message);
        }
    }

    static async insertTransactionInAcc(idAccount, transaction) {
        try{
            const account = await this.findById(idAccount);
            if (!account) {
                const error = new Error("Conta não encontrada para o ID: " + idAccount);
                error.status = 404;
                throw error; 
            }

            /* Para contas de cartões de crédito: 
                -> balance = fatura 
                -> availableLimit: 
                    - inicialmente recebe o valor de "credit-card"
                    - a cada transação o valor é alterado
                    - representa o valor disponível

                Para contas corrente e poupança: 
                -> balance = saldo 
                -> availableLimit: 
                    - a cada transação o valor é alterado
                    - tem o mesmo valor de saldo 
                    - representa o valor disponível
            */

            if (transaction.type === "credit"){   
                account.balance += transaction.amount;
                account.availableLimit += account.amount;
            } else {
                account.balance -= transaction.amount;
                account.availableLimit -= transaction.amount;
            }
            account.transactions.push(transaction._id);
            await account.save();
            return true;
    
        }catch(error){
            if (error.status) throw error;  //Erro por não encontrar id da conta

            const internalError = new Error("Erro interno ao buscar o saldo: " + error.message);
            internalError.status = 500;
            throw internalError;
        }
    }

    static async getTransactions(accountId) { 
        try{
            const account = await this.findById(accountId);
            if (!account) {
                const error = new Error("Conta não encontrada para o ID: " + accountId);
                error.status = 404;
                throw error;
            }

            const transactions = [];
            for (const transactionId of account.transactions) {
                const transaction = await TransactionServices.findById(transactionId);
                if (transaction) {
                    transactions.push(transaction);
                }
            }
            return transactions;
        }catch(error){
            if (error.status) throw error;  //Erro por não encontrar id da transação

            const internalError = new Error("Erro interno ao buscar transações: " + error.message);
            internalError.status = 500;
            throw internalError;
        }
    }

    static async getAll(){
        try{
            const accounts = await Account.find();
            return accounts;
        }catch(error){
           throw new Error("Erro interno ao buscar contas:" + error.message);
        }
    }
}

module.exports = AccountServices;