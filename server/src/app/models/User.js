const mongoose = require("mongoose");

// 사용자 모델
const UserSchema = new mongoose.Schema({
    userid: {type: String, unique: true, required: true}, // 사용자 아이디 (중복 불가)
    username: {type: String, required: true}, // 사용자 이름
    password: {type: String, required: true}, // 비밀번호 (암호화되어 저장됨)
    role: {type: String, default: 'user'}, // 사용자 권한 (user, admin 등)
    createdAt: {type: Date, default: () => Date.now() + (9 * 60 * 60 * 1000)}, // 계정 생성 시간 (한국 시간)
    profileImage: String, // 프로필 이미지 URL
    region: {type: mongoose.Schema.Types.ObjectId, ref: 'Region'}, // 사용자 지역 정보
    refreshToken: { type: String },  // JWT refreshToken - 인증 유지용
},{
    versionKey : false, // __v 필드 비활성화
});

const User = mongoose.models.User || mongoose.model('User', UserSchema, 'User');
module.exports = User;
