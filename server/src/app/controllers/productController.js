const {ProductService} = require('../services/productService');
const {GoogleDriveService} = require('../../utils/googleDriveService');
const Product = require('../models/Product');
const fs = require("node:fs");

class ProductController {
    constructor() {
        this.productService = new ProductService();
        this.googleDriveService = new GoogleDriveService();
    }

    async getCategories(req, res) {
        console.log('getCategories');
        try {
            const categories = await this.productService.fetchAllCategories();
            // console.log('category : ', categories);
            res.status(200).json(categories);
        } catch (err) {
            res.status(500).json({error: err.message});
        }
    }

    async postProduct(req, res, next) {
        console.log('postProduct ');

        try {
            const { productName, tradeType, price, description, category, isTemporary } = req.body;
            const userId = req.user.id;
            console.log('postProducts productName : ', productName);
            console.log('postProducts price : ', price);
            console.log('postProducts tradeType : ', tradeType);
            console.log('postProducts description : ', description);
            console.log('postProducts category : ', category);
            console.log('postProducts isTemporary : ', isTemporary);
            console.log('userId : ', userId);

            if (!req.files || req.files.length < 1) {
                return res.status(400).json({ error: '업로드 할 이미지가 없습니다.' });
            }

            // 파일 업로드
            const uploadPromises = req.files.map(async (file) => {
                try {
                    const uploadedUrl = await this.googleDriveService.uploadFile(file.path, file.originalname);
                    return uploadedUrl;
                } catch (uploadError) {
                    console.error(`파일 업로드 실패: ${file.filename}`, uploadError);
                    throw new Error('파일 업로드 중 오류가 발생했습니다.');
                } finally {
                    fs.unlinkSync(file.path);
                }
            });

            // 업로드된 이미지 URL들
            const imageUrls = await Promise.all(uploadPromises);

            // 상품 등록
            const newProduct = await this.productService.addProduct({
                name: productName,
                price,
                description,
                category,
                seller: userId,
                writeStatus : isTemporary? '등록' : '임시저장',
                transactionType : (tradeType==='sale'? '판매' : '나눔'),
                status : '판매중',
                region : '6794d5502182ffe7b3b86bdc', // 
                fileUrls : imageUrls,
            });

            return res.status(201).json({ message: '상품 등록 성공', product: newProduct });

        } catch (err) {
            next(err); // 글로벌 에러 핸들러로 전달
        }
    }

}

module.exports = {ProductController};