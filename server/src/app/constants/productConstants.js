// 거래 유형
const TRADE_TYPES = {
    SALE: '판매',
    SHARE: '나눔'
};

// 상품 상태
const PRODUCT_STATUS = {
    ON_SALE: '판매중',
    SOLD: '판매완료',
    TEMPORARY: '임시저장',
    DELETED: '삭제'
};

// 글 작성 상태
const WRITE_STATUS = {
    TEMPORARY: '임시저장',
    REGISTERED: '등록'
};

// 구글 드라이브 기본 URL
const GOOGLE_DRIVE = {
    BASE_URL: 'https://drive.google.com/uc?id='
};

module.exports = {
    TRADE_TYPES,
    PRODUCT_STATUS,
    WRITE_STATUS,
    GOOGLE_DRIVE
};
