const mongoose = require("mongoose");
const accountSchema = require("../models/Account");
const Account = mongoose.model("Account", accountSchema);
const CustomerController = require("../controllers/CustomerController");
const findByIdCust = CustomerController.findById;

const branchFixed = "0001";
const creditCardLimitFix = 500;

class AccountController{

    static async create(req,res) {
        let {idCustomer, type, creditCardLimit} = req.body;

        if(!idCustomer){
            return res.status(400).json({err: "O id do cliente é obrigatório!"})
        }

        let customerExist = await findByIdCust(idCustomer);
        if (!customerExist){
            return res.status(404).json({err: "Cliente não encontrado!"});
        }

        if(!type){
            return res.status(400).json({err: "O tipo da conta é obrigatório!"})
        } 
        let typeNew = type.toLowerCase();
        if(typeNew != "checking" && typeNew != "salvings" && typeNew != "credit-card"){
            return res.status(400).json({err: "O tipo de conta não existe!"})
        }
        
        try{
            let account = new Account();
            account.type = typeNew;
            account.branch = branchFixed;
            account.balance = 0;
            account.creditCardLimit = creditCardLimit || creditCardLimitFix;
            account.availableLimit = creditCardLimit || creditCardLimitFix;

            await account.save();
            console.log(account);
            
            let saveAccountInCustomer = await CustomerController.insertAccInCustomer(idCustomer, account);
            
            if(!saveAccountInCustomer){
                return res.status(500).json({ err: "Erro ao criar a conta." });
            }

            return res.status(201).send("Conta criada com sucesso!");
            
        }catch(err){
            console.error(err);
            return res.status(500).json({ err: "Erro ao criar a conta." });
        }
    }

    static async findById(id) {
        try {
            let account = await Account.findById(id);
            return account;
        } catch (err) {
            console.log("Erro ao buscar conta: " + err);
            return null;
        }
    }

    static async showBalance(req,res) {
        let {id} = req.params;

        if(!id){
            return res.status(400).json({err: "O id da conta é obrigatório!"})
        }
        
        try{
            let account = await AccountController.findById(id);
            if(!account){
                return res.status(404).json({err: "Conta não encontrada!"});
            }
            res.status(200).json({
                id: account._id,
                balance: account.balance
            });
        }catch(err){
            res.status(500).json({err: "Erro interno ao buscar o saldo."});
        }
    }

    static async insertTransactionInAcc(idAcc, newTransaction) {
        try{
            let account = await AccountController.findById(idAcc);

            if(newTransaction.type == "credit"){
                account.balance += newTransaction.amount;
            }else{
                account.balance -= newTransaction.amount;
            }

            account.transactions.push(newTransaction)
            await account.save();

            return true;
        }catch(err){
            console.log(err)
            return false;
        }
    }

    

}


module.exports = AccountController;