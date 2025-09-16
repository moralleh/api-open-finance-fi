class HomeController{

    static index(req,res){
        res.json({ message: "Intituição financeira" });
    }
}

module.exports = HomeController;