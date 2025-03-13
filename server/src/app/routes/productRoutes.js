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
        // Public routes
        /**
         * @route   GET /api/products/regions
         * @desc    지역 정보 목록 조회
         * @access  Public
         */
        this.router.get('/regions',
            this.productController.getRegions.bind(this.productController)
        );

        /**
         * @route   GET /api/products/categories
         * @desc    카테고리 목록 조회
         * @access  Public
         */
        this.router.get('/categories',
            this.productController.getCategories.bind(this.productController)
        );

        /**
         * @route   GET /api/products
         * @desc    전체 상품 목록 조회
         * @access  Public
         */
        this.router.get('/',
            this.productController.getProducts.bind(this.productController)
        );

        /**
         * @route   GET /api/products/:id
         * @desc    특정 상품 상세 정보 조회
         * @access  Public
         */
        this.router.get('/:id',
            this.productController.getDetailedProduct.bind(this.productController)
        );

        // Protected routes (인증 필요)
        /**
         * @route   GET /api/products/temp
         * @desc    임시저장된 상품 글 조회
         * @access  Private
         */
        this.router.get('/temp',
            this.authMiddleware.authenticateToken.bind(this.authMiddleware),
            this.productController.getTempPostProduct.bind(this.productController)
        );

        /**
         * @route   DELETE /api/products/temp
         * @desc    임시저장된 상품 글 삭제
         * @access  Private
         */
        this.router.delete('/temp',
            this.authMiddleware.authenticateToken.bind(this.authMiddleware),
            this.productController.deleteTempPostProduct.bind(this.productController)
        );

        /**
         * @route   POST /api/products
         * @desc    새로운 상품 등록 (최대 5개 이미지 업로드 가능)
         * @access  Private
         */
        this.router.post('/',
            this.authMiddleware.authenticateToken.bind(this.authMiddleware),
            this.uploadMiddleware.upload.array("images", 5),
            this.productController.postProduct.bind(this.productController)
        );

        /**
         * @route   GET /api/products/mySales
         * @desc    로그인한 사용자의 판매 상품 목록 조회
         * @access  Private
         */
        this.router.get('/mySales',
            this.authMiddleware.authenticateToken.bind(this.authMiddleware),
            this.productController.getUserSales.bind(this.productController)
        );

        /**
         * @route   GET /api/products/myPurchases
         * @desc    로그인한 사용자의 구매 상품 목록 조회
         * @access  Private
         */
        this.router.get('/myPurchases',
            this.authMiddleware.authenticateToken.bind(this.authMiddleware),
            this.productController.getUserPurchases.bind(this.productController)
        );

        /**
         * @route   DELETE /api/products/:id
         * @desc    특정 상품 삭제
         * @access  Private
         */
        this.router.delete('/:id',
            this.authMiddleware.authenticateToken.bind(this.authMiddleware),
            this.productController.deleteProduct.bind(this.productController)
        );
    }
}

module.exports = { ProductRoutes };
