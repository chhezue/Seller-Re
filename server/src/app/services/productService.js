const Category = require('../models/Category');
const Product = require("../models/Product");
const Region = require("../models/Region");
const DetailedProduct = require("../models/DetailedProduct");
const Favorite = require("../models/Favorite");
const ProductFile = require("../models/ProductFile");
const User = require("../models/User");

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
        console.log('addproduct ', product);
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
                const categoryData = await Category.findOne({name: category});
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


    // 에러 발생. mongoose.Types.ObjectId(userId) 에서 lock이 걸려버림
    // async getTempPostProductByUserId(userId) {
    //     return await Product.findOne({
    //         seller: mongoose.Types.ObjectId(userId),
    //         writeStatus: "임시저장",
    //         // DEL_YN 이 N 이거나, DEL_YN 필드 자체가 존재하지 않는경우 조회
    //         $or: [{DEL_YN: "N"}, {DEL_YN: {$exists: false}}],
    //     });
    // }
    async getTempPostProductByUserId(userId) {
        try {
            const product = await Product.findOne({
                // const product = await Product.find({
                seller: (userId),
                writeStatus: "임시저장",
                status : "임시저장",
                // $or: [
                //     {DEL_YN: {$exists: false}}, // DEL_YN 필드가 존재하지 않는 경우
                //     {DEL_YN: "N"} // DEL_YN이 "N"인 경우
                // ]
            }).sort({createdAt: -1});

            if (!product) {
                return null;
            }

            const category = await Category.findById(product.category).exec();
            const region = await Region.findById(product.region).exec();

            return {
                _id: product._id,
                name: product.name,
                category: category ? category.name : null,  // category.name으로 변환
                transactionType: product.transactionType,
                description: product.description,
                status: product.status,
                writeStatus: product.writeStatus,
                region: region ? region.name : null,  // region.name으로 변환
                price: product.price,
                fileUrls: product.fileUrls,
                fileNames: product.fileNames,
                createdAt: product.createdAt,
            };

        } catch (err) {
            console.error('쿼리 실행 중 오류 발생:', err); // 에러 발생 시 처리
            throw err; // 에러를 다시 던져서 호출한 곳에서 처리
        }
    }


    async deletePostProduct(userId, postId, originalStatus) {
        try {
            // //1. 완전삭제
            // const resultHardDelete = await Product.deleteOne({
            //     seller: userId,
            //     _id: postId,
            // });
            // // deldteCount === 0 : false. 삭제할 데이터가 없음
            // return (resultHardDelete.deletedCount !== 0);

            // //2. 삭제 플래그 변경
            // const resultSoftDelete = await Product.updateOne({
            //     seller: userId,
            //     _id: postId,
            // }, {
            //     $set: {DEL_YN: "Y"}
            // });
            // // matchedCount === 0 : false. 수정할 데이터가 없음
            
            // 2. 삭제 플래그 방법 변경
            const resultSoftDelete = await Product.updateOne({
                seller : userId, 
                _id : postId,
                status : originalStatus
            }, {
                $set: {status : "삭제"}
            })
            return (resultSoftDelete.matchedCount !== 0);
        } catch (err) {
            console.error('deletePostProduct', err);
            throw err;
        }
    }


    // 상품 상세 조회
    async getDetailedProduct(id) {
        try {
            // 불러와야 하는 것들: 이미지, 카테고리, 수정일, 찜 개수, 상품명, 상품 소개, 거래 희망 장소, 작성자
            // 불러와서 DetailedProduct 객체에 넣음.
            const detailedProduct = new DetailedProduct();

            // product 데이터 조회
            const product = await Product.findOne({_id: id});
            detailedProduct.product = product;

            // productFile 데이터 조회
            const productFiles = await ProductFile.find({product: id});
            detailedProduct.productFile = productFiles;

            // favorite 개수 조회
            // countDocuments: 문서의 개수 조회
            const favoriteCount = await Favorite.countDocuments({productId: id});
            detailedProduct.favoriteCount = favoriteCount;

            // user (작성자) 정보 조회
            const seller = await User.findById(product.seller);
            detailedProduct.seller = seller;

            // 거래 희망 장소 조회 어떻게..
            // detailedProduct.location = product.location;

            return detailedProduct;
        } catch (error) {
            console.error("상품 상세 출력 중 오류 발생:", error);
            throw error;
        }
    }
}

module.exports = {ProductService};