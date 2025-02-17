const Category = require('../models/Category');
const Product = require("../models/Product");
const Region = require("../models/Region");
const DetailedProduct = require("../models/DetailedProduct");

class ProductService {
    constructor() {

    }

    async fetchAllCategories() {
        // console.log(await Category.find());
        return await Category.find();
    }

    async fetchAllRegions() {
        // console.log(await Region.find());
        return await Region.find();
    }

    async addProduct(product) {
        const newProduct = new Product(product);
        return await newProduct.save();
    }

    // 모든 상품 목록 조회
    async getProducts(level1, level2, category) {
        try {
            let filter = {}; // 동적 필터 객체

            // 1. level1, level2로 region_id 찾기
            if (level1 || level2) {
                const regionFilter = {};
                if (level1) regionFilter.level1 = level1;
                if (level2) regionFilter.level2 = level2;

                const region = await Region.findOne(regionFilter);
                if (region) {
                    filter.region = region._id; // 찾은 region_id 추가
                } else {
                    return []; // 지역이 없으면 빈 배열 반환
                }
            }

            // 2. category로 category_id 찾기
            if (category) {
                const categoryData = await Category.findOne({ name: category });
                if (categoryData) {
                    filter.category = categoryData._id; // 찾은 category_id 추가
                } else {
                    return []; // 카테고리가 없으면 빈 배열 반환
                }
            }

            // 3. status가 '임시저장'인 것은 제외
            filter.status = '판매중' || '판매완료';

            // 4. 필터를 이용해 product 리스트 조회
            const products = await Product.find(filter);
            return products;
        } catch (error) {
            console.error("상품 조회 중 오류 발생:", error);
            throw error;
        }
    }

    // 상품 상세 조회
    async getDetailedProduct(id) {
        try {
            // 불러와야 하는 것들: 이미지, 카테고리, 수정일, 찜 개수, 상품명, 상품 소개, 거래 희망 장소, 작성자
            // product: 카테고리, 수정일, 상품명, 상품 소개
            // productFile: 이미지
            // favorite: 찜 개수
            // user: 작성자
            // 거래 희망 장소

            const productData = new ProductData();

            // product 데이터 조회
            const product = await Product.findOne({ _id: objectId });
            productData.product = product;

            // productFile 데이터 조회
            const productFiles = await ProductFile.find({ productId: objectId });
            productData.productFile = productFiles;

            // favorite 개수 조회
            const favoriteCount = await Favorite.countDocuments({ productId: objectId });
            productData.favoriteCount = favoriteCount;

            // user (작성자) 정보 조회
            const seller = await User.findById(product.sellerId);
            productData.seller = seller;

            // 거래 희망 장소 조회 (예시)
            productData.location = product.location; // product 모델에 location 필드가 있다고 가정


        } catch (error) {
            console.error("상품 조회 중 오류 발생:", error);
            throw error;
        }
    }
}

module.exports = {ProductService};