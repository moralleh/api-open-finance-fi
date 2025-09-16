const express = require("express");
const app = express();
const router = require("./routes/routes");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); 

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB conectado!'))
    .catch(err => console.log('Erro ao conectar MongoDB:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/",router);

app.listen(port, () => {
    console.log(`App rodando na porta ${port}`);
});