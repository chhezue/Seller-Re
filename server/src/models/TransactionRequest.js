const mongoose = require("mongoose");

const TransactionRequestSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: () => Date.now() + (9 * 60 * 60 * 1000) },
});

module.exports = mongoose.model('TransactionRequest', TransactionRequestSchema, 'TransactionRequest');