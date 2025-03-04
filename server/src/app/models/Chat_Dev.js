const mongoose = require("mongoose");

const Chat_DevSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: String,
    timestamp: { type: Date, default: () => Date.now() + (9 * 60 * 60 * 1000) },
    read: { type: Boolean, default: false } // 읽음 여부 추가
},{
    versionKey : false, // __v 필드 비활성화
});

// mongoose.models를 사용하여 중복 정의 방지
const Chat_Dev = mongoose.models.Chat_Dev || mongoose.model('Chat_Dev', Chat_DevSchema, 'Chat_Dev');
module.exports = Chat_Dev;
