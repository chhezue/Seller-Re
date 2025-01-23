// const connectDB = require('./utils/mongoose');
const {MakeDummy} = require('./utils/makeDummy');
const {app, PORT} = require('./app');

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

        app.listen(PORT, () => {
            console.log(`${PORT}번 포트에서 대기 중`);
        });
    }
}

new SellerRe();