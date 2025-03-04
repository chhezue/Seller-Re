const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swaggerConfig')

const http = require('http'); 
const { Server } = require('socket.io'); 

const {UserRoutes} = require("./routes/userRoutes");
const {ProductRoutes} = require("./routes/productRoutes");

class App {
    constructor() {
        this.app = express();
        
        // socket
        this.server = http.createServer(this.app);
        this.io = new Server(this.server, {
            cors : {
                origin : "http://localhost:3000",
                methods : ["GET", "POST"]
            }
        });
        this.setMiddlewares();
        this.setRoutes();
        this.setSwagger();
        this.setSocketEvents();
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
        //test code. react
        this.app.get('/api/test', (req, res) => {
            console.log('GET /api/test');
            res.send(JSON.stringify({
                "test": "OK",
            }))
        });
        //End test code. react
        this.app.use('/api/users', userRoutes.router);
        this.app.use('/api/products', productRoutes.router);
    }

    setSwagger() {
        // 주소: localhost:9000/api-docs
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }

    setSocketEvents(){
        let onlineUsers = {};   // 온라인 사용자 목록
        
        this.io.on('connection', (socket) => {
            console.log('new user connected : ', socket.id);
            
            socket.on('registerUser', (userId) => {
                onlineUsers[userId] = socket.id;
                console.log('online users : ', onlineUsers);
            })
            
            // 특정 유저의 메시지 가져오기
            socket.on("getMessages", async ({ sender, receiver }) => {
                const messages = await Chat.find({
                    $or: [
                        { sender, receiver },
                        { sender: receiver, receiver: sender }
                    ]
                }).sort({ timestamp: 1 });

                socket.emit("loadMessages", messages);
            });
        })
    }
    
    listen(port) {
        this.app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    }

}

module.exports = {App};