const express = require('express');
const { ProductController } = require('../controllers/productController');
const { AuthMiddleware } = require('../middlewares/authMiddleware');
const { UploadMiddleware } = require('../middlewares/uploadMiddleware');

class ProductRoutes {
    constructor() {
        this.router = express.Router();
        this.productController = new ProductController();
        this.authMiddleware = new AuthMiddleware();
        this.uploadMiddleware = new UploadMiddleware();
        this.initializeRoutes();
    }

    initializeRoutes() {
        // 지역 정보 가져오기를 상단으로 이동
        this.router.get('/regions', this.productController.getRegions.bind(this.productController));
        
        // 카테고리 정보 받아오기
        this.router.get('/categories', this.productController.getCategories.bind(this.productController));
        
        // 상품 목록 출력
        // GET /api/products/
        this.router.get('/', this.productController.getProducts.bind(this.productController));

        //게시판 글쓰기 전 임시저장글 확인
        this.router.get('/temp', this.authMiddleware.authenticateToken.bind(this.authMiddleware), this.productController.getTempPostProduct.bind(this.productController));
        // this.router.get('/temp', this.productController.getTempPostProduct.bind(this.productController));
        //임시저장글 삭제
        this.router.delete('/temp', this.authMiddleware.authenticateToken.bind(this.authMiddleware), this.productController.deleteTempPostProduct.bind(this.productController));

        //게시판 글쓰기
        // this.router.post('/', this.authMiddleware.authenticateToken.bind(this.authMiddleware), this.productController.postProduct.bind(this.productController));
        this.router.post('/', this.authMiddleware.authenticateToken.bind(this.authMiddleware), this.uploadMiddleware.upload.array("images", 5), this.productController.postProduct.bind(this.productController));

        // 로그인된 회원 판매 상품 조회
        this.router.get('/mySales', this.authMiddleware.authenticateToken.bind(this.authMiddleware), this.productController.getUserSales.bind(this.productController))

        // 상품 상세 정보 조회
        // GET /api/products/:id
        this.router.get('/:id', this.productController.getDetailedProduct.bind(this.productController));

        // 상품 삭제 라우트 추가
        this.router.delete('/:id', 
            this.authMiddleware.authenticateToken.bind(this.authMiddleware), 
            this.productController.deleteProduct.bind(this.productController)
        );
    }
}


module.exports = { ProductRoutes };
