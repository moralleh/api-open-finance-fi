const CustomerServices = require("../services/CustomerServices");
const AccountServices = require("../services/AccountServices");

class AccountController{

    static async create(req,res) {
        const branchFixed = "0001";
        const creditCardLimitFix = 500.00;

        let {idCustomer, type, creditCardLimit} = req.body;

        if(!idCustomer){
            return res.status(400).json({error: "O id do cliente é obrigatório!"})
        }

        let customerExist = await CustomerServices.findById(idCustomer);
        if (!customerExist){
            return res.status(404).json({error: "Cliente não encontrado!"});
        }

        if(!type){
            return res.status(400).json({error: "O tipo da conta é obrigatório!"})
        } 
        let typeNew = type.toLowerCase();
        if(typeNew != "checking" && typeNew != "salvings" && typeNew != "credit-card"){
            return res.status(400).json({error: "O tipo de conta não existe!"})
        }

        let creditCardLimitSave = null;

        if (typeNew === "credit-card") {

            if (creditCardLimit <= 0 ) {
                return res.status(400).json({ error: "O limite do cartão é inválido!"});
            }

            if (!creditCardLimit) {
                creditCardLimitSave = creditCardLimitFix;
            } else {
                creditCardLimitSave = Number(creditCardLimit);
            }
        }

        try{
            const account = {
                type: typeNew,
                branch: branchFixed,
                balance: 0.0, 
                creditCardLimit: typeNew === "credit-card" 
                    ? creditCardLimitSave 
                    : undefined,
                availableLimit: typeNew === "credit-card" 
                    ? creditCardLimitSave 
                    : 0.0
            }
            
            const idAccountSave = await AccountServices.saveAccount(account);

            const saveAccountInCustomer = await CustomerServices.insertAccInCustomer(idCustomer, idAccountSave);

            if (idAccountSave && saveAccountInCustomer) {
                return res.status(201).send("Conta criada com sucesso!");
            }

        }catch(error){
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }

    static async getBalance(req,res) {
        const {id} = req.params;

        if(!id){
            return res.status(400).json({error: "O id da conta é obrigatório!"})
        }
        
        try{ 
            const balance = await AccountServices.getBalance(id);   
            return res.status(200).json({ 
                id: id,
                balance: balance
             });

        }catch(error){
            const statusCode = error.status || 500;
            return res.status(statusCode).json({error: error.message });
        }
    }

    static async getTransactions(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "O id da conta é obrigatório!" });
        }

        try {
            const transactions = await AccountServices.getTransactions(id);
            return res.status(200).json({
                idConta: id,
                transactions: transactions
            });
        } catch (error) {
            const statusCode = error.status || 500;
            return res.status(statusCode).json({error: error.message });
        }
    }

    static async getAll(req,res){
        try{
            const accounts = await AccountServices.getAll();
            res.status(200).json({ accounts });
        }catch(error){
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
}



module.exports = AccountController;