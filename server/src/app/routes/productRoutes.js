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
        //게시판 전체보기
        this.router.get('/', this.productController.getProducts.bind(this.productController));
        
        //게시판 글쓰기 전 임시저장글 확인
        this.router.get('/temp', this.authMiddleware.authenticateToken.bind(this.authMiddleware), this.productController.getTempPostProduct.bind(this.productController));
        // this.router.get('/temp', this.productController.getTempPostProduct.bind(this.productController));
        //임시저장글 삭제
        this.router.delete('/temp', this.authMiddleware.authenticateToken.bind(this.authMiddleware), this.productController.deleteTempPostProduct.bind(this.productController));

        //게시판 글쓰기
        // this.router.post('/', this.authMiddleware.authenticateToken.bind(this.authMiddleware), this.productController.postProduct.bind(this.productController));
        this.router.post('/', this.authMiddleware.authenticateToken.bind(this.authMiddleware), this.uploadMiddleware.upload.array("images", 5), this.productController.postProduct.bind(this.productController));

        //카테고리 정보 받아오기
        this.router.get('/categories', this.productController.getCategories.bind(this.productController));
    }
}


module.exports = { ProductRoutes };
