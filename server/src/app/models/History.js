const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true },
    transactionType: { type: String, required: true },
    completedAt: { type: Date, default: () => Date.now() + (9 * 60 * 60 * 1000) },
    region: { type: mongoose.Schema.Types.ObjectId, ref: 'Region' },
    feedback: String,
    rating: { type: Number, min: 1, max: 5 },
},{
    versionKey : false, // __v 필드 비활성화
});

const History = mongoose.models.History || mongoose.model('History', HistorySchema, 'History'); 
module.exports = History;