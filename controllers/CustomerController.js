const CustomerServices = require("../services/CustomerServices");
const { checkDuplicateCPF, validateCPF } = require("../utils/validateCPF");

class CustomerController{

    static async create(req,res) {
        let {name, cpf, email} = req.body;

        if(!name || name.length <= 2){
            return res.status(403).json({error: "O nome é inválido!"});
        }

        if(!cpf){
            return res.status(403).json({error: "O cpf é inválido!"});
        }

        cpf = String(cpf).replace(/\D/g, '');

        let cpfExist = await checkDuplicateCPF(cpf);
        if(cpfExist){
            return res.status(409).json({error: "Já existe um cliente cadastrado com esse cpf."});
        }
        
        let cpfValidate = validateCPF(cpf);
        if(!cpfValidate){
            return res.status(400).json({error: "O cpf é inválido!"});
        }

        if(!email){
            return res.status(403).json({error: "O email é inválido!"});
        }

        try{
            const customer = {
                name: name,
                cpf: cpf,
                email: email
            }
            const resultSave = await CustomerServices.saveCustomer(customer);
            if (resultSave) {
                return res.status(201).send("Cliente criado com sucesso!");
            }
            
        }catch(error){
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }

    static async getById(req,res){
        try {        
            const customer = await CustomerServices.findById(req.params.id);
            if (!customer) {
                return res.status(404).json({ error: "Cliente não encontrado para o ID: " + req.params.id });
            }
            return res.status(200).json({ customer });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }        
    }

    static async getAccounts(req,res){
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "O id do cliente é obrigatório!" });
        }

        try {
            const accounts = await CustomerServices.getAccounts(id);
            return res.status(200).json({
                idConta: id,
                accounts: accounts
            });
        } catch (error) {
            const statusCode = error.status || 500;
            return res.status(statusCode).json({error: error.message });
        }
    }

    static async getAll(req,res){
        try{
            const customers = await CustomerServices.getAll();
            return res.status(200).json({ customers });
        }catch(error){
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = CustomerController;