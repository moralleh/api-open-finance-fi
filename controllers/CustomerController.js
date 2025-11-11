const customerSchema = require("../models/Customer");
const mongoose = require("mongoose");
const Customer = mongoose.model("Customer", customerSchema);
const { checkDuplicateCPF, validateCPF } = require("../utils/validateCPF");

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

        let cpfExist = await checkDuplicateCPF(cpf);
        if(cpfExist){
            return res.status(409).json({err: "Já existe um cliente cadastrado com esse cpf."});
        }
        
        let cpfValidate = validateCPF(cpf);
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

    static async findById(id) {
        try {
            let customer = await Customer.findById(id);
            return customer;
        } catch (err) {
            console.log("Erro ao buscar cliente: " + err);
            return null;
        }
    }

    static async insertAccInCustomer(id, idAccount) {
        try{
            const customer = await this.findById(id);
            customer.accounts.push(idAccount);
            await customer.save();
            return true;
        }catch(err){
            console.log(err)
            return false;
        }
    }


}

module.exports = CustomerController;