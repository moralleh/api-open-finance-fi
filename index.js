const express = require("express");
const app = express();
const router = require("./routes/routes");
const connectDB = require("./database/connection")

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/",router);

app.listen(3000, () => {
    console.log("App rodando na porta 3000");
});