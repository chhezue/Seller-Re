const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs'); // Add this line at the top

// ... rest of your dotenv.config.js code

class DotenvConfig {
    static load() {
        // const envPath = path.resolve(process.cwd(), '.env');
        const envPathForMac = path.resolve(__dirname, '../../.env');
        const envPathForWindow = path.resolve(__dirname, '../../.env');
        const envPath = fs.existsSync(envPathForMac) ? envPathForMac : envPathForWindow;
        const result = dotenv.config({ path: envPath });

        console.log('dot env path : ', envPath);

        if (result.error) {
            console.error('환경 변수 파일(.env)을 로드하는 데 실패했습니다:', result.error);
            process.exit(1); // 실패 시 프로세스 종료
        } else {
            console.log('환경 변수 파일(.env)을 성공적으로 로드했습니다.');
        }
    }
}

module.exports = {DotenvConfig};
