const category = require("express/lib/view");
const CATEGORY_TYPES = [
    { id: 1, name: '디지털기기' },
    { id: 2, name: '생활가전' },
    { id: 3, name: '가구/인테리어' },
    { id: 4, name: '생활/주방' },
    { id: 5, name: '유아동' },
    { id: 6, name: '유아도서' },
    { id: 7, name: '여성의류' },
    { id: 8, name: '여성잡화' },
    { id: 9, name: '남성패션/잡화' },
    { id: 10, name: '뷰티/미용' },
    { id: 11, name: '스포츠/레저' },
    { id: 12, name: '식물' },
    { id: 13, name: '취미/게임/음반' },
    { id: 14, name: '도서' },
    { id: 15, name: '티켓/교환권' },
    { id: 16, name: '가공식품' },
    { id: 17, name: '건강기능식품' },
    { id: 18, name: '반려동물식품' },
    { id: 19, name: '기타 중고물품' },
];

const getCategoryById = (id) => {
    const category = CATEGORY_TYPES.find((cat) => cat.id === id);
    return category ? category.name : null;
}

const getCategoryByName = (name) => {
    const id = CATEGORY_TYPES.find((cat) => cat.name === name)
    return id ? category.id : null;
}

module.exports = {
    CATEGORY_TYPES,
    getCategoryById,
    getCategoryByName,
};
