const mongoose = require('mongoose');
const { CATEGORY_TYPES } = require('../constants/categoryConstants');

// CATEGORY_TYPES 에서 name 속성만 추출하여 문자열 배열로 변환
const categoryNames = CATEGORY_TYPES.map(cat => cat.name);

// 카테고리 모델
const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: categoryNames,
        unique: true // 중복 카테고리 방지
    }}, {
    versionKey : false, // __v 필드 비활성화
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema, 'Category');

module.exports = Category;