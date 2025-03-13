const mongoose = require('mongoose');
const { CATEGORY_TYPES } = require('../constants/modelConstants');

// CATEGORY_TYPES에서 name 속성만 추출하여 문자열 배열로 변환
const categoryNames = CATEGORY_TYPES.map(cat => cat.name);

// 카테고리 모델: categoryNames에 저장된 이름만 사용 가능
const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: categoryNames, // 허용된 카테고리 이름만 사용 가능
        unique: true // 중복 카테고리 방지
    }}, {
    versionKey : false, // __v 필드 비활성화
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema, 'Category');

module.exports = Category;