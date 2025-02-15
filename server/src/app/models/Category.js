const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['디지털기기', '생활가전', '가구/인테리어', '생활/주방', '유아동', '유아도서',
            '여성의류', '여성잡화', '남성패션/잡화', '뷰티/미용', '스포츠/레저', '식물',
            '취미/게임/음반', '도서', '티켓/교환권', '가공식품', '건강기능식품', '반려동물식품', '기타 중고물품'],
        unique: true
    },
    code: {  // 코드 필드 추가
        type: String,
        required: true,
        unique: true // 코드 값도 유일해야 함
    }
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema, 'Category');


module.exports = Category;