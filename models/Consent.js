const mongoose = require("mongoose");
const generateID = require("../middlewares/generateID");

const consent = new mongoose.Schema ({
    _id: String,
    customerId: String,
    clientAppId: String,
    permissions: [String],
    status: String,
    createdAt: Date,
    expiresAt: Date
});

consent.pre("save", generateID("consent"));

module.exports = consent;