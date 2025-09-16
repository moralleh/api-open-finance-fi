class HomeController{

    async index(req,res){
        res.json({ message: "Intituição financeira" });
    }
}

module.exports = new HomeController();