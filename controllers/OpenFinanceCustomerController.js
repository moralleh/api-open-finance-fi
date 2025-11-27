const ConsentServices = require("../services/ConsentServices");
const CustomerServices = require("../services/CustomerServices");

class OpenFinanceCustomerController{
    static async getById(req,res){
        try { 
            let { id } = req.params;

            const clientAppId = "app_openfinance_001";
            const consent = await ConsentServices.findActiveByCustomerAndApp(
                id,
                clientAppId
            );

            if (!consent) {
                return res.status(403).json({error: "Consentimento não autorizado para este cliente"});
            }
            
            const customer = await CustomerServices.findById(id);
            if (!customer) {
                return res.status(404).json({ error: "Cliente não encontrado para o ID: " + id });
            }

            const { _id, name, cpf } = customer;
            return res.status(200).json({ _id, name, cpf });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }            
    }

    static async getAccounts(req,res){
        try {
            let { id } = req.params;

            const clientAppId = "app_openfinance_001";
            const consent = await ConsentServices.findActiveByCustomerAndApp(
                id,
                clientAppId
            );

            if (!consent) {
                return res.status(403).json({error: "Consentimento não autorizado para este cliente"});
            }

            if (!Array.isArray(consent.permissions) || !consent.permissions.includes("accounts")) {
                return res.status(403).json({
                    error: "Consentimento não possui permissão para acessar contas"
                });
            }

            const accounts = await CustomerServices.getAccounts(id);

            // Retorna apenas os dados permitidos pelo Open Finance
            const filteredAccounts = accounts.map((account) => ({
                _id: account._id,
                type: account.type,
                branch: account.branch,
                number: account.number,
            }));

            return res.status(200).json(filteredAccounts);
        } catch (error) {
            const statusCode = error.status || 500;
            return res.status(statusCode).json({error: error.message });
        }
    }

}

module.exports = OpenFinanceCustomerController;