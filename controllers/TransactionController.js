const mongoose = require("mongoose");
const transactionSchema = require("../models/Transaction");
const Transaction = mongoose.model("Transaction", transactionSchema);
const AccountController = require("./AccountController")
const findByIdAcc = AccountController.findById;

class TransactionController{
    
    static async create(req,res) {
        let {idAcc, description, amount, type, category, totalInstallments, currentIntallment} = req.body;

        if(!idAcc){
            return res.status(400).json({err: "O id da conta é obrigatório!"});
        }

        let accountExist = findByIdAcc(idAcc);
        if (!accountExist){
            return res.status(404).json({err: "Conta não encontrada!"});
        }

        if(!description){
            return res.status(400).json({err: "A descrição da transação é obrigatória!"});
        }

        if(!amount){
            return res.status(400).json({err: "O valor da transação é obrigatório!"});
        }
        if(amount <= 0){
            return res.status(400).json({err: "O valor da transação é inválido!"})
        }     
          
        if(!type){
            return res.status(400).json({err: "O tipo da transação é obrigatório!"})
        } 
        let typeNew = type.toLowerCase();
        if(typeNew != "credit" && typeNew != "debit"){
            return res.status(400).json({err: "O tipo de transação não existe!"})
        }
        
        if (accountExist.type == "credit-card"){
            if (!totalInstallments){
                return res.status(400).json({err: "O total do número de parcelas é obrigatório!"});
            }
            if (totalInstallments <= 0 || currentIntallment <= 0){
                return res.status(400).json({err: "O número de parcelas é inválido!"});
            }
            if(currentIntallment > totalInstallments){
                return res.status(400).json({err: "O número da parcela atual não pode ser maior que o total de parcelas!"});
            }
            let validAmount = await this.checkCreditCardLimit(idAcc, type, amount);
            if(!validAmount){
                return res.status(403).json({err: "O valor da transação é maior do que o limite do cartão de crédito"});
            }

        } else {
            totalInstallments = 1;
            currentIntallment = 1;
        }

        let validAmount = await this.checkBalance(idAcc,type,amount);
        if(!validAmount){
            return res.status(403).json({err: "O saldo da conta é insuficiente para realizar transação!"});
        }

        if(!category){
            return res.status(400).json({err: "A categoria da transação é obrigatória!"})
        }

        try{
            let transaction = new Transaction();
            transaction.date = new Date();
            transaction.description = description;
            transaction.amount = amount;
            transaction.type = typeNew;
            transaction.category = category;
            transaction.totalInstallments = totalInstallments;
            transaction.currentInstallment = currentIntallment;

            await transaction.save();
            console.log(transaction);
            
            let savetransactionInAcc = await AccountController.insertTransactionInAcc(idAcc, transaction);

            if(!savetransactionInAcc){
                return res.status(500).json({ err: "Erro ao criar a transação." });
            }

            return res.status(201).send("Transação realizada com sucesso!");
            
        }catch(err){
            console.error(err);
            return res.status(500).json({ err: "Erro ao criar a conta." });
        }
    }

    static async checkBalance(idAcc, type, amount) {
        const account = await findByIdAcc(idAcc);
        if(type == "debit" && account.balance < amount){
            return false;
        }
        return true;
    }

    static async checkCreditCardLimit(idAcc, type, amount) {
        const account = await findByIdAcc(idAcc);
        if(type == "credit-card" && account.availableLimit < amount){
            return false;
        }
        return true;
    }

    static async showTransactions(req,res) {
       let {idAcc} = req.params;

        if(!idAcc){
            return res.status(400).json({err: "O id da conta é obrigatório!"})
        }
        
        try{
            let account = await findByIdAcc(idAcc);
            if(!account){
                return res.status(404).json({err: "Conta não encontrada!"});
            }
            res.status(200).json({
                idConta: account._id,
                transactions: account.transactions
            });
        }catch(err){
            res.status(500).json({err: "Erro interno ao buscar as transações."});
        }
    }


}

module.exports = TransactionController;