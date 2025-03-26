const mongoose = require("mongoose");
const { TRADE_TYPES, PRODUCT_STATUS, WRITE_STATUS } = require('../constants/productConstants');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true }, // 상품명
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    tradeType: {
        type: String,
        required: true,
        enum: Object.values(TRADE_TYPES)
    },
    description: { type: String, required: true },
    createdAt: { type: Date, default: () => Date.now() + (9 * 60 * 60 * 1000) }, // 상품 등록 시간 (한국 시간)
    updatedAt: { type: Date },
    deletedAt: { type: Date },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 판매자 정보
    status: {
        type: String,
        required: true,
        enum: Object.values(PRODUCT_STATUS)
    },
    writeStatus: {
        type: String,
        required: true,
        enum: Object.values(WRITE_STATUS),
    },
    region: { type: mongoose.Schema.Types.ObjectId, ref: 'Region', required: true },
    price: { type: Number, required: true, default: 0 },
    fileUrls: { type: [String], default: [] }, // 상품 이미지 URL 배열
    fileNames: { type: [String], default: [] }, // 상품 이미지 파일명 배열
},{
    versionKey : false, // __v 필드 비활성화
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema, 'Product');
module.exports = Product;
