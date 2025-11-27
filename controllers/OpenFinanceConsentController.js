const CustumerServices = require("../services/CustomerServices");
const ConsentServices = require("../services/ConsentServices");

class OpenFinanceConsentController {
    static consentExpirationMs = 6 * 30 * 24 * 60 * 60 * 1000;
    
    static async create(req,res) {
        let {customerId, clientAppId, permissions} = req.body;

        try {
            const customer = await CustumerServices.findById(customerId);
            if (!customer) {
                return res.status(404).json({ error: "Cliente não encontrado" });
            }

            const existingConsent = await ConsentServices.findActiveByCustomerAndApp(customerId,clientAppId);

            if (existingConsent) {
                return res.status(409).json({
                    error: "Já existe um consentimento ativo para este cliente e aplicação",
                    consentId: existingConsent._id,
                });
            }

            const validPermissions = ["accounts", "transactions"];
            const invalidPermissions = permissions.filter(
                (p) => !validPermissions.includes(p)
            );

            if (invalidPermissions.length > 0) {
                return res.status(400).json({
                    error: `Permissões inválidas: ${invalidPermissions.join(
                        ", "
                    )}`,
                });
            }

            const consent = {
                customerId: customerId,
                clientAppId: clientAppId,
                permissions: permissions,
                status: "active",
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + this.consentExpirationMs)
            }

            const resultSave = await ConsentServices.saveConsent(consent);

            if(resultSave) {
                res.status(201).json("Consentimento criado com sucesso!");
            }

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }

    static async revoke(req, res) {
        try {
            const consent = await ConsentServices.findById(req.params.id);
            if (!consent) {
                return res.status(404).json({ error: "Consentimento não encontrado" });
            }

            if (consent.clientAppId !== clientAppId) {
                return res.status(403).json({ error: "Acesso não autorizado a este consentimento" });
            }

            const resultRevoked = await ConsentServices.updateStatus(id, "revoked")

            if (resultRevoked) {
                res.status(204).json("Consentimento revogado com sucesso!");
            }
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAll(req,res){
        try{
            const consents = await ConsentServices.getAll();
            res.status(200).json({ consents });
        }catch(error){
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }

    static async getById(req,res) {
        const consent = await ConsentServices.findById(req.params.id);
        if (!consent){
            return res.status(404).json({ error: "Consentimento não encontrado" });
        }
        return res.status(200).json(consent);
    }

}


module.exports = OpenFinanceConsentController;