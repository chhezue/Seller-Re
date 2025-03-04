const {Server} = require('socket.io');
const Chat = require('./models/Chat_Dev');

class SocketHandler {
    constructor(server) {
        this.io = new Server(server, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"],
            }
        });

        this.onlineUsers = {};  // 현재 온라인 사용자 목록

        this.setupSocketEvents();
    }

    setupSocketEvents() {
        this.io.on('connection', (socket) => {
            console.log('New User Connection : ', socket.id);
            
            // 사용자 등록
            socket.on('registerUser', (userId) => {
                this.onlineUsers[userId] = socket.id;
                console.log('Online Users : ', this.onlineUsers);
            });
            
            // 메시지 불러오기
            socket.on("getMessages", async ({sender, receiver}) => {
                const messages = await Chat.find({
                    $or : [
                        {sender,  receiver},
                        {sender : receiver, receiver : sender}
                    ]
                }).sort.emit("loadMessages", messages);
            });
            
            // 메시지 전송
            socket.on("sendMessage", async (data) => {
                const {sender, receiver, message} = data;
                const newMessage = new Chat({sender, receiver,  message});
                await newMessage.save();
                
                // 수신자가 온라인이면 실시간 메시지 전송
                if (this.onlineUsers[receiver]) {
                    this.io.to(this.onlineUsers[receiver]).emit("receiveMessage", newMessage);
                }
                
                // 발신자에게도 메시지 전송
                socket.emit("receiveMessage", newMessage);
            });
            
            // 사용자 연결 해제
            socket.on("receiveMessage", async () => {
                for (let userId in this.onlineUsers){
                    if(this.onlineUsers[userId] === socket.id){
                        delete this.onlineUsers[userId];
                        break;
                    }
                }
                console.log('User disconnect : ', socket.id);
            });
        });
    }
}

module.exports = {SocketHandler};