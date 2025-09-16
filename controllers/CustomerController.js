const customerSchema = require("../models/Customer");
const mongoose = require("mongoose");
const Customer = mongoose.model("Customer", customerSchema);

class CustomerController{

    static async create(req,res) {
        let {name, cpf, email} = req.body;

        if(!name || name.length <= 2){
            return res.status(403).json({err: "O nome é inválido!"});
        }

        if(!cpf){
            return res.status(403).json({err: "O cpf é inválido!"});
        }

        cpf = String(cpf).replace(/\D/g, '');

        let cpfExist = await CustomerController.checkDuplicateCPF(cpf);
        if(cpfExist){
            return res.status(409).json({err: "Já existe um cliente cadastrado com esse cpf."});
        }
        
        let cpfValidate = CustomerController.validateCPF(cpf);
        if(!cpfValidate){
            return res.status(400).json({err: "O cpf é inválido!"});
        }

        if(!email){
            return res.status(403).json({err: "O email é inválido!"});
        }

        try{
            let customer = new Customer();
            customer.name = name;
            customer.cpf = cpf;
            customer.email = email;

            await customer.save();
            console.log(customer);
            return res.status(201).send("Cliente criado com sucesso!");
            
        }catch(err){
            console.error(err);
            return res.status(500).json({ err: "Erro interno ao criar o cliente." });
        }
    }

    static async checkDuplicateCPF(cpf){
        try {
            let customer = await Customer.findOne({ cpf: cpf });
            return customer ? true : false
        }catch(err){
            console.log("Erro ao verificar CPF duplicado: " + err);
            return false;
        }
    }

    static validateCPF(cpf) {
        if (cpf.length !== 11) return false;
        if (/^('\d')\1+$/.test(cpf)) return false;

        const calculateDigit = (cpf, factor) => {
            let total = 0;
            for (let i = 0; i < factor - 1; i++) {
                total += parseInt(cpf[i]) * (factor - i);
            }
            let remainder = total % 11;
            return remainder < 2 ? 0 : 11 - remainder;
        };

        if (calculateDigit(cpf, 10) !== parseInt(cpf[9])) return false;
        if (calculateDigit(cpf, 11) !== parseInt(cpf[10])) return false;

        return true;
    }

    static async findById(id) {
        try {
            let customer = await Customer.findById(id);
            return customer;
        } catch (err) {
            console.log("Erro ao buscar cliente: " + err);
            return null;
        }
    }

    static async insertAccInCustomer(id, newAccount) {
        try{
            let customer = await CustomerController.findById(id);
            customer.accounts.push(newAccount);
            await customer.save();
            return true;
        }catch(err){
            console.log(err)
            return false;
        }
    }

}

module.exports = CustomerController;