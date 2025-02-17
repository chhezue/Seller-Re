const product = require('Product');
const productFile = require('ProductFile');
const favorite = require('Favorite');
const user = require('User');

class DetailedProduct {
    constructor() {
        this.product = {};
        this.productFile = [];
        this.favoriteCount = 0;
        this.seller = {};
        // this.location = ""; // 거래 희망 장소 어떻게 해야 하는지
    }
}