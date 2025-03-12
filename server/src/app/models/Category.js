const mongoose = require('mongoose');
const { CATEGORY_TYPES } = require('../constants/modelConstants');

// CATEGORY_TYPES에서 name 속성만 추출하여 문자열 배열로 변환
const categoryNames = CATEGORY_TYPES.map(cat => cat.name);

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: categoryNames,
        unique: true
    }}, {
    versionKey : false, // __v 필드 비활성화
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema, 'Category');

module.exports = Category;