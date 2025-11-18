function verifyInternalKey(req, res, next) {
    const key = req.headers["x-api-key"];
    if (key !== process.env.INTERNAL_API_KEY) {
        return res.status(403).json({ error: "API Key inválida" });
    }
    next();
}

function verifyOpenFinanceKey(req, res, next) {
    const key = req.headers["x-api-key"];
    if (key !== process.env.OPEN_FINANCE_API_KEY) {
        return res.status(403).json({ error: "API Key inválida para open finance" });
    }
    next();
}

module.exports = {
    verifyInternalKey,
    verifyOpenFinanceKey
};
