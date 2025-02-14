const {ProductService} = require('../services/productService');
const {GoogleDriveService} = require('../../utils/googleDriveService');
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

    async postProduct(req, res) {
        console.log('postProduct ');
        try {
            const {productName, tradeType, price, description, category} = req.body;
            console.log('postProducts productName : ', productName);
            console.log('postProducts price : ', price);
            console.log('postProducts tradeType : ', tradeType);
            console.log('postProducts description : ', description);
            console.log('postProducts category : ', category);

            if (!req.files || req.files.length < 1) {
                return res.status(400).json({error: '업로드 할 이미지가 없습니다.'});
            }

            const imageUrls = [];

            for (const file of req.files) {
                try {
                    const uploadedUrl = await this.googleDriveService.uploadFile(file.path, file.originalname);
                    imageUrls.push(uploadedUrl);
                } catch (uploadError) {
                    console.error(` 파일 업로드 실패 : ${file.filename}`, uploadError);
                    return res.status(500).json({error: '파일 업로드중 오류가 발생했습니다.'});
                } finally {
                    fs.unlinkSync(file.path);
                }
            }
            
            //service 이용하여 db에 저장하기
            res.status(201).json({message: '상품 등록 성공',})

        } catch (err) {
            res.status(500).json({error: err.message});
        }
    }
}

module.exports = {ProductController};