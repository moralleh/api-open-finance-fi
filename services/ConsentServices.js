const mongoose = require("mongoose");
const consentSchema = require("../models/Consent");
const Consent = mongoose.model("Consent", consentSchema);

class ConsentServices{
    static async findById(id) {
        try{
            const consent = await Consent.findById(id);
            return consent;
        } catch(error) {
            throw new Error("Erro ao buscar consentimento: " + error.message);
        }
    }

    static async updateStatus(id, status) {
        try{
            const consent = await Consent.findByIdAndUpdate(
                id,
                { status: status },
                { new: true }
            );
            return consent;
        } catch(error) {
            throw new Error("Erro ao atualizar status do consentimento: " + error.message);
        }
    }

    static async findActiveByCustomerAndApp(customerId, clientAppId) {
        try{
            const consent = await Consent.findOne({ 
                customerId: customerId, 
                clientAppId: clientAppId,
                status: "active", 
                expiresDate: { $gt: new Date() } 
            });
            if(consent) return consent;
            return null;
        } catch(error) {
            throw new Error("Erro ao buscar consentimento: " + error.message);
        }
    }

    static async saveConsent(newConsent){
        try {
            const consent = new Consent();
            consent.customerId = newConsent.customerId;
            consent.clientAppId = newConsent.clientAppId;
            consent.permissions = newConsent.permissions;
            consent.status = newConsent.status;
            consent.createdAt = newConsent.createdAt;
            consent.expiresDate = newConsent.expiresDate;

            await consent.save();
            console.log(consent);
            return true;
        } catch(error) {
            throw new Error("Erro interno ao salvar consentimento:" + error.message);
        }
    }

    static async getAll() {
        try {
            const consents = await Consent.find({
                status: "active",
                expiresDate: { $gt: new Date() },
            });
            return consents;
        } catch (error) {
           throw new Error("Erro interno ao buscar consentimentos:" + error.message);
        }
    }
}

module.exports = ConsentServices;