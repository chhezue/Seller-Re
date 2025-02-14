const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // 카테고리 참조
    transactionType: {
        type: String,
        required: true,
        enum: ['판매', '나눔']
    },
    description: String,
    createdAt: { type: Date, default: () => Date.now() + (9 * 60 * 60 * 1000) },
    updatedAt: Date,
    deletedAt: Date,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        required: true,
        enum: ['판매중', '판매완료']
    },
    writeStatus: {
        type: String,
        required: true,
        enum: ['임시저장', '등록']
    },
    region: { type: mongoose.Schema.Types.ObjectId, ref: 'Region' },
    price : {type: Number, default: 0},
    fileUrls: { type: [String], default: [] }
},{
    versionKey : false, // __v 필드 비활성화
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema, 'Product');
module.exports = Product;
