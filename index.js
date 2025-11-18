const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); 

const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const internalRoutes = require("./routes/internal.routes");
const openFinanceRoutes = require("./routes/openfinance.routes");

const {
    verifyInternalKey,
    verifyOpenFinanceKey
} = require("./middlewares/auth.middleware");

app.use("/openfinance", verifyOpenFinanceKey, openFinanceRoutes);
app.use("/", verifyInternalKey, internalRoutes);

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB conectado!'))
    .catch(err => console.log('Erro ao conectar MongoDB:', err));

app.use((req, res) => {
    res.status(404).json({ error: "Rota não encontrada" });
});

app.listen(port, () => {
    console.log(`App rodando na porta ${port}`);
});
