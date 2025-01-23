// const connectDB = require('./utils/mongoose');
const {MakeDummy} = require('./utils/makeDummy');

class SellerRe{
    constructor(data) {
        // connectDB();
        this.startSellerRe();
    }

    startSellerRe() {
        if (process.argv.includes("--makedummy")){
            console.log('make dummy');
            // throw new Error('error!');
            const makeDummy = new MakeDummy();
            makeDummy.makeUser();
        }
    }
}

new SellerRe();