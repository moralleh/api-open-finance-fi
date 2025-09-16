const mongoose = require("mongoose");

async function connectDB(){
    try{
        await mongoose.connect("mongodb://localhost:27017/bank");
        console.log("Conectado ao MongoDB com sucesso!");
    }catch(err){
        console.log("Erro ao conectar ao banco: ", err);
    }
}


module.exports = connectDB;