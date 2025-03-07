import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:9000"; // 백엔드 주소
let socket = null;

export const connectSocket = (token) => {
    if (!socket) {
        socket = io(SERVER_URL, {
            auth: {
                token: token, // JWT 토큰 포함
            },
            transports: ["websocket"],
        });

        socket.on("connect", () => {
            console.log("WebSocket Connected: ", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("WebSocket Disconnected");
        });

        socket.on("receiveMessage", (message) => {
            console.log("New Message:", message);
        });
    }
};

export const registerUser = (userId) => {
    if (socket) {
        socket.emit("registerUser", userId);
        console.log("User Registered: ", userId);
    }
};

export const sendMessage = (sender, receiver, message) => {
    if (socket) {
        console.log('SEND MESSAGE : ', sender, receiver, message);
        socket.emit("sendMessage", { sender, receiver, message });
    }
};

export const getMessages = (sender, receiver, setChatHistory) => {
    if (socket) {
        socket.emit("getMessages", { sender, receiver });
        socket.on("loadMessages", (messages) => {
            console.log("Chat History:", messages);
            // 받은 메시지를 chatHistory 상태에 업데이트
            setChatHistory(messages);
        });
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = () => socket;