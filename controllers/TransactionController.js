const AccountServices = require("../services/AccountServices");
const TransactionServices = require("../services/TransactionServices");

class TransactionController{
    
    static async create(req,res) {
        let {accountId, description, amount, type, category, totalInstallments, currentInstallment, date} = req.body;

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

        if(!date) {
            return res.status(400).json({error: "A data é obrigatória!"});
        }

        const dateObj = new Date(date);

        if (isNaN(dateObj.getTime())) {
            return res.status(400).json({ error: "A data é inválida!" });
        }

        const dateNew = dateObj.toISOString().split('T')[0];

        // Validar amount ------------------------------------------------------------
        
        if (amount === undefined || amount === null) {
            return res.status(400).json({ error: "O valor da transação é obrigatório!" });
        }

        // Converter para número
        amount = Number(amount);

        if (isNaN(amount)) {
            return res.status(400).json({ error: "O valor da transação deve ser um número válido!" });
        }

        if (amount <= 0) {
            return res.status(400).json({ error: "O valor da transação é inválido!" });
        }
         
        // ------------------------------------------------------------------------

        if(!type){
            return res.status(400).json({error: "O tipo da transação é obrigatório!"})
        } 
        let typeNew = type.toLowerCase();
        if(typeNew != "credit" && typeNew != "debit"){
            return res.status(400).json({error: "O tipo de transação não existe!"})
        }
        
        if (accountExist.type === "credit-card"){
            if (totalInstallments == null) {
                return res.status(400).json({ error: "O total do número de parcelas é obrigatório!" });
            }
            if (currentInstallment == null) {
                return res.status(400).json({ error: "O número da parcela atual é obrigatório!" });
            }

            // Converter para número
            totalInstallments = Number(totalInstallments);
            currentInstallment = Number(currentInstallment);

            if (isNaN(totalInstallments) || isNaN(currentInstallment)) {
                return res.status(400).json({ error: "Os valores das parcelas devem ser números válidos!" });
            }

            if (totalInstallments <= 0 || currentInstallment <= 0) {
                return res.status(400).json({ error: "O número de parcelas deve ser maior que zero!" });
            }

            if (currentInstallment > totalInstallments) {
                return res.status(400).json({ error: "A parcela atual não pode ser maior que o total de parcelas!" });
            }

            const validCreditLimit = await TransactionServices.validlimit(accountExist.creditCardLimit, amount);
            if(!validCreditLimit){
                return res.status(403).json({error: "O valor da transação é maior do que o limite do cartão de crédito"});
            }

        } else {
            if (accountExist.type === "debit") {
                const validAmount = await TransactionServices.validlimit(accountExist.balance, amount);
                if(!validAmount){
                    return res.status(403).json({error: "O saldo da conta é insuficiente para realizar transação!"});
                }
            }
            totalInstallments = 1;
            currentInstallment = 1;   
        }

        try{
            const transaction = {
                date: dateNew,
                description: description,
                amount: amount,
                type: typeNew,
                category: category,
                totalInstallments: totalInstallments,
                currentInstallment: currentInstallment,
            }

            const transactionId = await TransactionServices.saveTransaction(transaction);

            const savetransactionInAcc = await AccountServices.insertTransactionInAcc(accountId, transactionId);

           if (transactionId && savetransactionInAcc){
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
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = TransactionController;