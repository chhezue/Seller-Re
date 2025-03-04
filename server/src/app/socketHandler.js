const {Server} = require('socket.io');
const Chat = require('./models/Chat_Dev');
const {JwtUtils} = require('../utils/jwtUtils');

class SocketHandler {
    constructor(server) {
        this.io = new Server(server, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"],
            }
        });

        this.jwtUtils = new JwtUtils();
        this.onlineUsers = {};  // 현재 온라인 사용자 목록

        this.setupSocketEvents();
    }

    setupSocketEvents() {
        this.io.use((socket, next) => this.authenticateSocket(socket, next)); // JWT 인증 미들웨어 적용

        this.io.on('connection', (socket) => {
            console.log('New User Connected: ', socket.userId);

            socket.on('registerUser', (userId) => this.handleRegisterUser(socket, userId));
            socket.on('getMessages', async (data) => await this.handleGetMessages(socket, data));
            socket.on('sendMessage', async (data) => await this.handleSendMessage(socket, data));
            socket.on('disconnect', () => this.handleDisconnect(socket));
        });
    }

    authenticateSocket(socket, next) {
        const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

        if (!token) {
            console.log("No token provided");
            return next(new Error("Authentication error: No token provided"));
        }

        try {
            const decoded = this.jwtUtils.verifyAccessToken(token);
            socket.userId = decoded.id; // 유저 ID 저장
            next();
        } catch (err) {
            console.log("JWT Authentication failed: ", err.message);
            return next(new Error("Authentication error: Invalid token"));
        }
    }

    handleRegisterUser(socket, userId) {
        this.onlineUsers[userId] = socket.id;
        console.log('Online Users: ', this.onlineUsers);
    }

    async handleGetMessages(socket, { sender, receiver }) {
        try {
            const messages = await Chat.find({
                $or: [
                    { sender, receiver },
                    { sender: receiver, receiver: sender }
                ]
            }).sort({ createdAt: 1 });

            socket.emit("loadMessages", messages);
        } catch (error) {
            console.error("Error fetching messages: ", error);
        }
    }

    async handleSendMessage(socket, { sender, receiver, message }) {
        try {
            const newMessage = new Chat({ sender, receiver, message });
            await newMessage.save();

            if (this.onlineUsers[receiver]) {
                this.io.to(this.onlineUsers[receiver]).emit("receiveMessage", newMessage);
            }

            socket.emit("receiveMessage", newMessage);
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    }

    handleDisconnect(socket) {
        for (let userId in this.onlineUsers) {
            if (this.onlineUsers[userId] === socket.id) {
                delete this.onlineUsers[userId];
                break;
            }
        }
        console.log('User Disconnected: ', socket.id);
    }
}

module.exports = {SocketHandler};