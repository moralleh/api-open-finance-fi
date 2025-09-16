function generateNumber() {
    return async function() {
        if (!this.number) {
            const lastDoc = await this.constructor.findOne({}).sort({number: -1}).exec();
            let newNumber;
            let dig = Math.floor(Math.random() * 10);

            if (lastDoc && lastDoc.number) {
                const lastNumber = parseInt(lastDoc.number.split("-")[0]);
                newNumber = lastNumber + 1;
            }else{
                newNumber = 123;
            }
            
            let accountNumber = String(newNumber).padStart(5, "0");
            this.number = accountNumber + "-" + dig;
        }
        return this.number;
    }
};

module.exports = generateNumber;