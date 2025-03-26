const {ProductService} = require('../services/productService');
const {GoogleDriveService} = require('../../utils/googleDriveService');
const {FileService} = require('../services/fileService');
const { PRODUCT_STATUS } = require('../constants/productConstants');

class ProductController {
    constructor() {
        this.productService = new ProductService();
        this.googleDriveService = new GoogleDriveService();
        this.fileService = new FileService();
    }
    
    // 전체 카테고리 목록을 조회
    async getCategories(req, res) {
        try {
            const categories = await this.productService.fetchAllCategories();
            // console.log('category : ', categories);
            res.status(200).json(categories);
        } catch (err) {
            res.status(500).json({error: err.message});
        }
    }

    // 전체 지역 목록을 조회
    async getRegions(req, res) {
        try {
            const regions = await this.productService.fetchAllRegions();
            // console.log('region : ', regions);
            res.status(200).json(regions);
        } catch (err) {
            res.status(500).json({error: err.message});
        }
    }

    // 상품 등록
    async createProduct(req, res, next) {
        try {
            const userId = req.user.id;
            const productData = req.body;

            // 이미지 업로드 처리
            const { imageUrls } = await this.fileService.handleProductImages(req);

            // 상품 생성 (upsert 사용)
            const newProduct = await this.productService.updateOrCreateProduct(null, { ...productData, fileUrls: imageUrls, seller: userId });

            return res.status(201).json({ message: '상품 등록 성공', product: newProduct });
        } catch (err) {
            next(err);
        }
    }

    // 상품 수정
    async updateProduct(req, res, next) {
        try {
            const userId = req.user.id;
            const productId = req.params.id;
            const productData = req.body;

            // 이미지 업로드 및 삭제 처리
            const { imageUrls, deletedImages } = await this.fileService.handleProductImages(req);

            // 상품 수정 (upsert 사용)
            const updatedProduct = await this.productService.updateOrCreateProduct(productId, { ...productData, fileUrls: imageUrls, deletedImages, seller: userId });

            return res.status(200).json({ message: '상품 수정 성공', product: updatedProduct });
        } catch (err) {
            next(err);
        }
    }

    // 필터링된 상품 목록 페이지네이션 조회
    async getProducts(req, res, next) {
        console.log('getProducts ');

        // 필터 조건: 지역, 카테고리
        // 유저는 필터 조건을 보내지 않을 수도 있으므로(전체 조회) req.params가 아닌 req.query 사용
        // 요청 URL: seller_re_backend/posts?level1=경기도&level2=인천&category=도서
        const { level1, level2, category, tradeType, page = 1, limit = 20 } = req.query;
        console.log('level1: ', level1, '\tlevel2: ', level2, '\tcategory: ', category, '\ttradeType: ', tradeType);

        try {
            const skip = (page - 1) * limit;
            const products = await this.productService.getProducts(level1, level2, category, tradeType, skip, limit);
            return res.status(201).json({ message: `${tradeType} 타입의 상품 목록 조회 성공`, products: products });
        } catch (err) {
            next(err); // 글로벌 에러 핸들러로 전달
        }
    }

    // 임시저장 상품 조회
    async getTempPostProduct(req, res) {
        try {
            const userId = req.user.id;
            console.log('getTempPostProduct ');
            console.log('userId : ', userId);
            const tempPost = await this.productService.getTempPostProductByUserId(userId);
            console.log('getTempPost', tempPost);

            if (tempPost === null) {
                return res.status(404).json({message: '임시 저장된 글이 없습니다.'});
            }
            return res.status(200).json(tempPost);
        } catch (err) {

        }
    }

    // 임시저장 상품 삭제
    async deleteTempPostProduct(req, res) {
        try {
            const userId = req.user.id;
            const tempPostProduct = await this.productService.getTempPostProductByUserId(userId);
            if (!tempPostProduct) {
                console.log('임시 저장된 글이 없습니다.');
                return res.status(404).json({message: "임시 저장된 글이 없습니다."})
            }
            console.log('임시 저장 글 삭제: ', tempPostProduct);

            if (tempPostProduct.fileUrls && tempPostProduct.fileUrls.length > 0) {
                await this.googleDriveService.deleteFile(tempPostProduct.fileUrls, process.env.GOOGLE_DRIVE_PRODUCTS_IMAGE);
            }

            return await this.productService.deletePostProduct(userId, tempPostProduct._id, PRODUCT_STATUS.TEMPORARY) ?
                res.status(204) : res.status(404).json({message: "삭제할 데이터가 없습니다."});
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: err.message});
        }
    }

    // 상품 상세 정보 조회
    async getDetailedProduct(req, res, next) {
        console.log('getDetailedProduct ');

        try {
            const productId = req.params.id;
            const product = await this.productService.getDetailedProduct(productId);
            
            if (!product) {
                return res.status(404).json({message: '상품을 찾을 수 없습니다.'});
            }
            
            return res.status(200).json({message: '상품 상세 조회 성공', detailedProduct: product});
        } catch (err) {
            next(err); // 글로벌 에러 핸들러로 전달
        }
    }

    // 사용자의 판매 상품 목록 조회
    async getUserSales(req, res) {
        try {
            const userId = req.user.id;
            const products = await this.productService.fetchUserSales(userId);
            // console.log("products: ", products);
            res.status(200).json(products);
        } catch (err) {
            console.error("판매 상품 조회 오류:", err);
            res.status(500).json({message: "서버 오류", error: err.message});
        }
    }

    // 사용자의 구매 상품 목록 조회
    async getUserPurchases(req, res) {
        try {
            const userId = req.user.id;
            const products = await this.productService.fetchUserPurchases(userId);
            // console.log("products: ", products);
            res.status(200).json(products);
        } catch (err) {
            console.error("판매 상품 조회 오류:", err);
            res.status(500).json({message: "서버 오류", error: err.message});
        }
    }

    // 상품 삭제
    async deleteProduct(req, res) {
        try {
            const userId = req.user.id; // JWT 토큰에서 디코딩된 사용자 정보
            const productId = req.params.id;
            
            // 상품 존재 확인
            const product = await this.productService.getDetailedProduct(productId);
            
            if (!product) {
                return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
            }
            
            // 소유자 확인
            let sellerId = typeof product.seller === 'object' ? product.seller._id : product.seller;
            if (String(sellerId) !== String(userId)) {
                return res.status(403).json({ message: "본인의 상품만 삭제할 수 있습니다." });
            }
            
            const originalStatus = product.status;
            const isDeleted = await this.productService.deletePostProduct(userId, productId, originalStatus);
            
            if (isDeleted) {
                return res.status(200).json({ message: "상품이 성공적으로 삭제되었습니다." });
            } else {
                return res.status(404).json({ message: "삭제할 상품을 찾을 수 없습니다." });
            }
        } catch (err) {
            console.error("상품 삭제 중 오류 발생:", err);
            return res.status(500).json({ message: "서버 오류", error: err.message });
        }
    }
}

module.exports = {ProductController};