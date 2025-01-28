const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userid: {type: String, unique: true, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, default: 'user'},
    createdAt: {type: Date, default: () => Date.now() + (9 * 60 * 60 * 1000)},
    profileImage: String,
    region: {type: mongoose.Schema.Types.ObjectId, ref: 'Region'},
},{
    versionKey : false, // __v 필드 비활성화
});

// mongoose.models를 사용하여 중복 정의 방지
const User = mongoose.models.User || mongoose.model('User', UserSchema, 'User');
module.exports = User;
