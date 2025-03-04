import { useEffect, useState } from "react";
import { connectSocket, registerUser, sendMessage, getMessages, disconnectSocket } from "../../utils/socket";

const ChatPage = ({ user, token }) => {
    const [receiver, setReceiver] = useState("");
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);

    useEffect(() => {
        console.log("ChatPage Loaded. user:", user, "token:", token);

        if (!user || !user.id) {
            console.error("user 객체가 없습니다.");
            return;
        }
        
        if (token) {
            connectSocket(token);
            registerUser(user.id);
        }

        return () => {
            disconnectSocket();
        };
    }, [token, user]);

    const handleSendMessage = () => {
        if (message.trim() && receiver) {
            sendMessage(user.id, receiver, message);
            setMessage("");
        }
    };

    const handleGetMessages = () => {
        getMessages(user.id, receiver);
    };

    return (
        <div className="p-5 max-w-lg mx-auto bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold mb-2">🔹 1:1 Chat</h2>
            <input
                type="text"
                placeholder="Receiver ID"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                className="border rounded p-2 w-full mb-2"
            />
            <button onClick={handleGetMessages} className="bg-blue-500 text-white p-2 rounded w-full mb-2">
                Load Messages
            </button>
            <div className="border p-2 h-40 overflow-auto mb-2">
                {chatHistory.map((msg, index) => (
                    <div key={index} className="p-1 border-b">
                        <strong>{msg.sender === user.id ? "You" : "Them"}:</strong> {msg.message}
                    </div>
                ))}
            </div>
            <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border rounded p-2 w-full"
            />
            <button onClick={handleSendMessage} className="bg-green-500 text-white p-2 rounded w-full mt-2">
                Send
            </button>
        </div>
    );
};

export default ChatPage;
