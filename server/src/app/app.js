const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig')

const {UserRoutes} = require("./routes/userRoutes");

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
            methods: ["GET", "POST", "PUT", "DELETE", "FETCH"], // 허용할 HTTP 메서드
            credentials: true // 쿠키 인증이 필요한 경우 설정
        }));
    }

    setRoutes() {
        const userRoutes = new UserRoutes();
        //test code. react
        this.app.get('/api/test', (req, res) => {
            console.log('GET /api/test');
            res.send(JSON.stringify({
                "test": "OK",
            }))
        });
        //End test code. react
        this.app.use('/api/users', userRoutes.router);
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