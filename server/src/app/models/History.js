const mongoose = require("mongoose");

// 완료된 거래 내역 모델
const HistorySchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true },
    completedAt: { type: Date, default: () => Date.now() + (9 * 60 * 60 * 1000) },
    feedback: String,
    rating: { type: Number, min: 1, max: 5 },
    /**
     * feedback 과 rating 은 서로에게 줄 수 있는데 해당 관계성은 설정해주지 않아도 괜찮은지
     *  // 구매자의 판매자 평가
     *     buyerFeedback: {
     *         feedback: String, // 구매자가 작성한 판매자 후기
     *         rating: { type: Number, min: 1, max: 5 }, // 구매자가 준 판매자 평점
     *         createdAt: { type: Date } // 평가 작성 시간
     *     },
     *
     *  // 판매자의 구매자 평가
     *  sellerFeedback: {
     *     feedback: String, // 판매자가 작성한 구매자 후기
     *     rating: { type: Number, min: 1, max: 5 }, // 판매자가 준 구매자 평점
     *     createdAt: { type: Date } // 평가 작성 시간
     *  }
     */
},{
    versionKey : false, // __v 필드 비활성화
});

const History = mongoose.models.History || mongoose.model('History', HistorySchema, 'History'); 
module.exports = History;