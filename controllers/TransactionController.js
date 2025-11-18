const AccountServices = require("../services/AccountServices");
const TransactionServices = require("../services/TransactionServices");

class TransactionController{
    
    static async create(req,res) {
        let {accountId, description, amount, type, category, totalInstallments, currentIntallment} = req.body;

        if(!accountId){
            return res.status(400).json({error: "O id da conta é obrigatório!"});
        }

        let accountExist = await AccountServices.findById(accountId);
        if (!accountExist){
            return res.status(404).json({error: "Conta não encontrada!"});
        }

        if(!category){
            return res.status(400).json({error: "A categoria da transação é obrigatória!"})
        }

        if(!description){
            return res.status(400).json({error: "A descrição da transação é obrigatória!"});
        }

        if(!amount){
            return res.status(400).json({error: "O valor da transação é obrigatório!"});
        }
        if(amount <= 0){
            return res.status(400).json({error: "O valor da transação é inválido!"})
        }     
          
        if(!type){
            return res.status(400).json({error: "O tipo da transação é obrigatório!"})
        } 
        let typeNew = type.toLowerCase();
        if(typeNew != "credit" && typeNew != "debit" && typeNew != "credit-card"){
            return res.status(400).json({error: "O tipo de transação não existe!"})
        }
        
        if (accountExist.type === "credit-card"){
            if (!totalInstallments){
                return res.status(400).json({error: "O total do número de parcelas é obrigatório!"});
            }
            if (totalInstallments <= 0 || currentIntallment <= 0){
                return res.status(400).json({error: "O número de parcelas é inválido!"});
            }
            if(currentIntallment > totalInstallments){
                return res.status(400).json({error: "O número da parcela atual não pode ser maior que o total de parcelas!"});
            }
            const validCreditLimit = await TransactionServices.checkLimit(accountExist.creditCardLimit, amount);
            if(!validCreditLimit){
                return res.status(403).json({error: "O valor da transação é maior do que o limite do cartão de crédito"});
            }

        } else {
            if (accountExist.type === "debit") {
                const validAmount = await TransactionServices.checkLimit(accountExist.balance, amount);
                if(!validAmount){
                    return res.status(403).json({error: "O saldo da conta é insuficiente para realizar transação!"});
                }
            }
            totalInstallments = 1;
            currentIntallment = 1;   
        }

        try{
            const transaction = {
                date: new Date(),
                description: description,
                amount: amount,
                type: typeNew,
                category: category,
                totalInstallments: totalInstallments,
                currentIntallment: currentIntallment
            }

            const idTransactionSave = await TransactionServices.saveTransaction(transaction);

            const savetransactionInAcc = await AccountServices.insertTransactionInAcc(accountId, idTransactionSave);

           if (idTransactionSave && savetransactionInAcc){
                return res.status(201).send("Transação realizada com sucesso!");
           }
        
        }catch(error){
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }

    static async getAll(req,res){
        try{
            const transactions = await TransactionServices.getAll();
            res.status(200).json({ transactions });
        }catch(error){
            const statusCode = error.status || 500;
            return res.status(statusCode).json({error: error.message });
        }
    }
}

module.exports = TransactionController;