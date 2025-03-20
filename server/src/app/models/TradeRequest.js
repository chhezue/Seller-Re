const mongoose = require("mongoose");

// 거래 요청 모델
const TradeRequestSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // 구매 희망 상품
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 구매 요청자 (구매희망자)
    createdAt: { type: Date, default: () => Date.now() + (9 * 60 * 60 * 1000) }, // 요청 생성 시간 (한국 시간)
},{
    versionKey : false, // __v 필드 비활성화
});

const TradeRequest = mongoose.models.TradeRequest || mongoose.model('TradeRequest', TradeRequestSchema, 'TradeRequest');
module.exports = TradeRequest;