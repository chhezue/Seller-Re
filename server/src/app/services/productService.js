const Category = require('../models/Category');
const Product = require("../models/Product");
const Region = require("../models/Region");
const Favorite = require("../models/Favorite");
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
        const newProduct = new Product(product);
        return await newProduct.save();
    }

    // 모든 상품 목록 조회
    async getProducts(level1, level2, category, transactionType, skip, limit) {
        try {
            let filter = { status: '판매중' };

            // 1. level1, level2로 region_id 찾기
            if (level1 || level2) {
                const regionFilter = {};
                if (level1) regionFilter.level1 = level1;
                if (level2) regionFilter.level2 = level2;

                const regions = await Region.find(regionFilter); // findOne을 find로 변경
                if (regions && regions.length > 0) {
                    filter.region = { $in: regions.map(r => r._id) }; // 여러 region_id를 포함하도록 수정
                } else {
                    return [];
                }
            }

            // 2. category로 category_id 찾기
            if (category) {
                filter.category = category;
            }

            // 3. transactionType(나눔, 판매) 필터 추가
            if (transactionType) {
                filter.transactionType = transactionType;
            }

            const products = await Product.find(filter)
                .skip(parseInt(skip))
                .limit(parseInt(limit))
                .populate('region', 'level1 level2')
                .populate('category', 'name')
                .sort({ updatedAt: -1, createdAt: -1 }); // updatedAt → createdAt 순으로 정렬

            // MongoDB 문서를 JSON으로 변환할 때 날짜를 ISO 문자열로 변환
            return products.map(product => {
                const productObj = product.toObject(); // Mongoose 문서를 일반 객체로 변환
                return {
                    _id: productObj._id,
                    name: productObj.name,
                    price: productObj.price,
                    fileUrls: productObj.fileUrls,
                    transactionType: productObj.transactionType,
                    region: productObj.region ? `${productObj.region.level1} ${productObj.region.level2}` : null,
                    category: productObj.category?.name,
                    createdAt: productObj.createdAt?.toISOString(),
                    updatedAt: productObj.updatedAt?.toISOString(),
                    favoriteCount: productObj.favoriteCount
                };
            });
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
        console.log('getTempPostProductByUserId 호출됨, userId:', userId); // 함수 호출 여부 확인


        try {
            const product = await Product.findOne({
                seller: (userId),
                writeStatus: "임시저장",
                $or: [
                    {DEL_YN: {$exists: false}}, // DEL_YN 필드가 존재하지 않는 경우
                    {DEL_YN: "N"} // DEL_YN이 "N"인 경우
                ]
            }).sort({createdAt: -1});
            
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
                createdAt: product.createdAt,
            };
            
        } catch (err) {
            console.error('쿼리 실행 중 오류 발생:', err); // 에러 발생 시 처리
            throw err; // 에러를 다시 던져서 호출한 곳에서 처리
        }
    }


    async deleteTempPostProductByUserId(userId) {}


    // 상품 상세 조회(상품 아이디로 연결)
    // 수정 필요: 거래 희망 장소, 파일 이미지 업로드
    async getDetailedProduct(productId) {
        console.log('[getDetailedProduct], productId:', productId);

        try {
            // product 데이터 조회
            const product = await Product.findOne({ _id: productId });
            console.log('Found product:', product);
            
            if (!product) {
                throw new Error('상품을 찾을 수 없습니다.');
            }

            const category = await Category.findById(product.category);
            const region = await Region.findById(product.region); console.log('Found region:', region);
            const favoriteCount = await Favorite.countDocuments({ productId: productId });
            const seller = await User.findById(product.seller).populate('region');

            // 필요한 정보만 객체로 구성하여 반환
            return {
                _id: product._id, // 상품 id
                name: product.name, // 상품 이름
                category: category ? category.name : null, // category.name으로 반환
                transactionType: product.transactionType, // 거래 유형(판매, 나눔)
                description: product.description, // 상품 설명
                status: product.status, // 상품 상태(판매중, 판매완료, 임시저장)
                writeStatus: product.writeStatus,
                region: region ? `${region.level1} ${region.level2}` : null, // region.name으로 변환
                price: product.price,
                fileUrls: product.fileUrls,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
                favoriteCount: favoriteCount,
                seller: {
                    _id: seller._id,
                    username: seller.username,
                    profileImage: seller.profileImage,
                    region: seller.region ? `${seller.region.level1} ${seller.region.level2}` : null,
                }
            };
        } catch (error) {
            console.error("상품 상세 출력 중 오류 발생:", error);
            throw error;
        }
    }


    // 판매 상품 조회
    async fetchUserSales(userId) {
        try {
            const filter = {
                seller: userId,
                deletedAt: null,
                writeStatus: '등록'
            };
            return await Product.find(filter).populate("category", "name").populate("region", "level2");

        } catch (err) {
            console.error("판매 상품 조회 오류", err);
            throw new Error("판매 상품을 불러오는 중 오류가 발생했습니다.");
        }
    }
}

module.exports = {ProductService};