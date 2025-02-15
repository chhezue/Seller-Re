const {DotenvConfig} = require('./config/dotenv.config');
const connectDB = require('./config/mongoose');
const { MakeDummy } = require('./utils/makeDummy');
const {App} = require('./app/app');

class SellerRe{
    constructor() {
        DotenvConfig.load(); // 환경 변수 로드
        connectDB();
        
        this.app = new App();
        this.startSellerRe();
    }

    startSellerRe() {
        if (process.argv.includes("--makedummy")){
            console.log('make dummy');
            // throw new Error('error!');
            const makeDummy = new MakeDummy();
            makeDummy.makeUser();
            // makeDummy.makeRegion();
            makeDummy.makeProduct();
        }

        try {
            this.app.listen(process.env.PORT, () => {
                console.log(`${process.env.PORT}번 포트에서 서버가 실행 중입니다.`);
            });
        } catch (err) {
            if (err.code === 'EADDRINUSE') {
                console.error(`${process.env.PORT}번 포트가 이미 사용 중입니다.`);
                process.exit(1); // 오류 발생 시 프로세스 종료
            } else {
                console.error('서버 실행 중 오류 발생:', err);
                process.exit(1);
            }
        }
    }
}

new SellerRe();