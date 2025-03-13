const mongoose = require("mongoose");

// 찜 모델: user와 product 간의 N:M 관계 설정
const FavoriteSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // 찜한 상품
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 찜한 사용자
    createdAt: { type: Date, default: Date.now }, // 찜 생성 시간
},{
    versionKey : false, // __v 필드 비활성화
});

const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema, 'Favorite');  
module.exports = Favorite;