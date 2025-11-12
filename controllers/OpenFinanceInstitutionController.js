const institution = {
    id: "if_225",
    name: "Nubank",
    status: true
}

class OpenFinanceInstitutionController {
    static async getInstitutionData(req,res) {
        try {
            return res.status(200).json(institution);
        } catch(error) {
            return res.status(500).json({error: "Erro interno no servidor"});
        }
    }
}

module.exports = OpenFinanceInstitutionController;