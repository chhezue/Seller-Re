const mongoose = require("mongoose");

/**
 * 상품 모델
 * 
 * 판매 또는 나눔할 상품 정보를 저장하는 모델입니다.
 * 상품명, 카테고리, 거래 유형, 가격, 판매자 정보 등을 포함합니다.
 */
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true }, // 상품명
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // 카테고리 참조
    transactionType: {
        type: String,
        required: true,
        enum: ['판매', '나눔'] // 거래 유형: 판매 또는 나눔
    },
    description: String, // 상품 설명
    createdAt: { type: Date, default: () => Date.now() + (9 * 60 * 60 * 1000) }, // 상품 등록 시간 (한국 시간)
    updatedAt: Date, // 상품 정보 수정 시간
    deletedAt: Date, // 상품 삭제 시간 (소프트 삭제)
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 판매자 정보
    status: {
        type: String,
        required: true,
        enum: ['판매중', '판매완료', '임시저장', '삭제'] // 상품 상태
    },
    writeStatus: {
        type: String,
        required: true,
        enum: ['임시저장', '등록'] // 글 작성 상태
    },
    region: { type: mongoose.Schema.Types.ObjectId, ref: 'Region' }, // 판매 지역
    price : {type: Number, default: 0}, // 상품 가격
    fileUrls: { type: [String], default: [] }, // 상품 이미지 URL 배열
    fileNames: { type: [String], default: [] }, // 상품 이미지 파일명 배열
},{
    versionKey : false, // __v 필드 비활성화
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema, 'Product');
module.exports = Product;
