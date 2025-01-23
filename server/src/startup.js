// const connectDB = require('./utils/mongoose');
const { MakeDummy } = require('./utils/makeDummy');
const { app, PORT } = require('./app');
require('dotenv').config();

class SellerRe{
    constructor() {
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

        try {
            app.listen(PORT, () => {
                console.log(`${PORT}번 포트에서 대기 중`);
            });
        }catch (err){
            console.error(err);
            console.error(`${PORT} already in use`);
            process.exit(1);
        }
    }
}

new SellerRe();