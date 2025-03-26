const mongoose = require("mongoose");
const { ROLE_TYPES } = require("../constants/userConstants");

const UserSchema = new mongoose.Schema({
    userid: {type: String, unique: true, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true}, // bcrypt 암호화 필요
    role: {
        type: String,
        required: true,
        enum: Object.values(ROLE_TYPES),
        default: 'User',
    },
    createdAt: {type: Date, default: () => Date.now() + (9 * 60 * 60 * 1000)},
    profileImage: String,
    region: {type: mongoose.Schema.Types.ObjectId, ref: 'Region'},
    refreshToken: { type: String },  // JWT refreshToken: 인증 유지용
},{
    versionKey : false, // __v 필드 비활성화
});

const User = mongoose.models.User || mongoose.model('User', UserSchema, 'User');
module.exports = User;
