const ConsentServices = require("../services/ConsentServices");
const CustomerServices = require("../services/CustomerServices");
const AccountServices = require("../services/AccountServices");

class OpenFinanceAccountController{

    static async getBalance(req,res) {
        try{
            let {id} = req.params;
            let { clientAppId } = req.body;

            if (!clientAppId) {
                return res.status(400).json({ error: "O id da aplicação é obrigatório!" });
            }

            const account = await AccountServices.findById(id);
            if (!account) {
                return res.status(404).json({ error: "Conta não encontrada" });
            }

            const customers = await CustomerServices.getAll();
            const customer = customers.find((c) =>
                c.accounts.includes(account._id)
            );

            if (!customer) {
                return res.status(404).json({ error: "Cliente não encontrado" });
            }

            const consent = await ConsentServices.findActiveByCustomerAndApp(
                customer._id,
                clientAppId
            );

            if (!consent) {
                return res.status(403).json({ error: "Consentimento não autorizado para esta conta" });
            }

            if (!consent.permissions.includes("accounts")) {
                return res.status(403).json({ error: "Consentimento não possui permissão para acessar saldo" });
            }
            
            const balance = await AccountServices.getBalance(id);   
            return res.status(200).json(balance);

        }catch(error){
            const statusCode = error.status || 500;
            return res.status(statusCode).json({error: error.message });
        }
    }

    static async getTransactions(req, res) {
        try {
            let {id} = req.params;
            let { clientAppId } = req.body;

            if (!clientAppId) {
                return res.status(400).json({ error: "O id da aplicação é obrigatório!" });
            }

            const account = await AccountServices.findById(id);
            if (!account) {
                return res.status(404).json({ error: "Conta não encontrada" });
            }

            const customers = await CustomerServices.getAll();
            const customer = customers.find((c) =>
                c.accounts.includes(account._id)
            );

            if (!customer) {
                return res.status(404).json({ error: "Cliente não encontrado" });
            }

            const consent = await ConsentServices.findActiveByCustomerAndApp(
                customer._id,
                clientAppId
            );

            if (!consent) {
                return res.status(403).json({ error: "Consentimento não autorizado para esta conta" });
            }

            if (!consent.permissions.includes("transactions")) {
                return res.status(403).json({ error: "Consentimento não possui permissão para acessar transações" });
            }

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
}



module.exports = OpenFinanceAccountController;