const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig')

const {UserRoutes} = require("./routes/userRoutes");
const {ProductRoutes} = require("./routes/productRoutes");
const {AuthRoutes} = require("./routes/authRoutes");

class App {
    constructor() {
        this.app = express();
        this.setMiddlewares();
        this.setRoutes();
        this.setSwagger();
    }

    setMiddlewares() {
        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(express.urlencoded({extended: true}));
        // CORS 설정 (React 서버 URL을 명시)
        this.app.use(cors({
            origin: "http://localhost:3000", // React 개발 서버 주소
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // 허용할 HTTP 메서드
            credentials: true // 쿠키 인증이 필요한 경우 설정
        }));
    }

    setRoutes() {
        const userRoutes = new UserRoutes();
        const productRoutes = new ProductRoutes();
        const authRoutes = new AuthRoutes();

        // 테스트를 위한 API 엔드포인트 코드 시작('/api/test' 경로로 GET 요청이 들어오면 아래 함수 실행)
        this.app.get('/api/test', (req, res) => {
            console.log('GET /api/test');

            // 클라이언트에게 JSON 형식의 응답을 보냄(서버가 정상적으로 작동하는지 확인)
            res.send(JSON.stringify({
                "test": "OK",
            }))
        });
        // 테스트를 위한 API 엔드포인트 코드 끝

        this.app.use('/api/users', userRoutes.router);
        this.app.use('/api/products', productRoutes.router);
        this.app.use('/api/auth', authRoutes.router);
    }

    setSwagger() {
        // 주소: localhost:9000/api-docs
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }

    listen(port) {
        this.app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    }
}

module.exports = {App};