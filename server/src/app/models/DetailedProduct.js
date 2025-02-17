class DetailedProduct {
    constructor() {
        // 불러와야 하는 것들: 이미지, 카테고리, 수정일, 찜 개수, 상품명, 상품 소개, 거래 희망 장소, 작성자
        this.product = {};
        this.productFiles = [];
        this.favoriteCount = 0;
        this.seller = {};
        // this.location = ""; // 거래 희망 장소 어떻게 해야 하는지
    }
}

module.exports = DetailedProduct;