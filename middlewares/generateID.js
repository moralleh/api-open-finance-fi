function generateID(prefix) {

    return async function(next) {
        if (!this._id) {

            const lastDoc = await this.constructor.findOne({}).sort({_id: -1}).exec();
            let newIdNumber;

            if (lastDoc && lastDoc._id) {
                const lastNumber = parseInt(lastDoc._id.split("_")[1]);
                newIdNumber = lastNumber + 1;
            }else{
                newIdNumber = 1;
            }

            this._id = prefix + "_" + String(newIdNumber).padStart(3, "0");
        }
        next();
    }
};

module.exports = generateID;
