const mongoose = require("mongoose");
const consentSchema = require("../models/Consent");
const Consent = mongoose.model("Consent", consentSchema);
const CustomerController = require("./CustomerController");

class OpenFinanceConsentController {
    constructor(){
        this.consentExpirationMs = 6 * 30 * 24 * 60 * 60 * 1000;
    }

    static async create(req,res) {
        try {
            const customer = await CustomerController.findById(req.body.customerId);
            if (!customer) {
                return res.status(404).json({ error: "Cliente não encontrado" });
            }

            const existingConsent = await this.findByIdCustomerAndApp(req.body.customerId,req.clientAppId);

            if (existingConsent) {
                return res.status(409).json({
                    error: "Já existe um consentimento ativo para este cliente e aplicação",
                    consentId: existingConsent._id,
                });
            }

            const validPermissions = ["accounts", "transactions"];
            const invalidPermissions = req.body.permissions.filter(
                (p) => !validPermissions.includes(p)
            );

            if (invalidPermissions.length > 0) {
                return res.status(400).json({
                    error: `Permissões inválidas: ${invalidPermissions.join(
                        ", "
                    )}`,
                });
            }

            // Cria o novo consentimento
            const consent = new Consent();
            consent.customerId = req.body.customerId;
            consent.clientAppId = req.clientAppId;
            consent.permissions = req.body.permissions;
            consent.status = "active";
            consent.createdAt = new Date();
            consent.expiresDate = new Date(Date.now() + this.consentExpirationMs);

            await consent.save();

            res.status(201).json(consent);

        } catch (error) {
            if (
                error.message.includes("obrigatório") ||
                error.message.includes("inválido")
            ) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: error.message });
        }
    }

    static async findByIdCustomerAndApp(customerId, clientAppId) {
        try{
            const consent = await Consent.findOne({ customerId: customerId, clientAppId: clientAppId });
            return consent;
        } catch{
            console.log(err);
            return null;
        }
    }

    static async findById(id) {
        try{
            const consent = await Consent.findById(id);
            return consent;
        } catch {
            console.log(err);
            return null;
        }
    }
    static async getById(req,res) {
        const consent = await this.findById(req.params.id);
        if (!consent){
            return res.status(404).json({ error: "Consentimento não encontrado" });
        }
        return res.status(200).json(consent);
    }

    static async revoke(req, res) {
        try {
            const consent = await this.findById(req.params.id);
            if (!consent) {
                return res.status(404).json({ error: "Consentimento não encontrado" });
            }

            if (consent.clientAppId !== req.clientAppId) {
                return res.status(403).json({ error: "Acesso não autorizado a este consentimento" });
            }

            const revoked = await Consent.findByIdAndUpdate(
                req.params.id, 
                { status: "revoked" },
                { new: true }
            );
                
            res.status(204).send();

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAll(req, res) {
        try {
            const consents = await Consent.find({
                status: "active",
                expiresDate: { $gt: new Date() },
            });

            if (consents.length === 0){
                return res.status(404).json({ error: "Não há nenhum consentimento." });
            }

            return res.status(200).json(consents);
        } catch (error) {
           return res.status(500).json({ error: error.message });
        }
    }


    
}


module.exports = OpenFinanceConsentController;