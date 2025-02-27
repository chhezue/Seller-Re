const {ProductService} = require('../services/productService');
const {GoogleDriveService} = require('../../utils/googleDriveService');
const fs = require("node:fs");

class ProductController {
    constructor() {
        this.productService = new ProductService();
        this.googleDriveService = new GoogleDriveService();
    }

    async getCategories(req, res) {
        try {
            const categories = await this.productService.fetchAllCategories();
            // console.log('category : ', categories);
            res.status(200).json(categories);
        } catch (err) {
            res.status(500).json({error: err.message});
        }
    }

    // 지역 가져오기
    async getRegions(req, res) {
        console.log('getRegions');
        try {
            const regions = await this.productService.fetchAllRegions();
            // console.log('region : ', regions);
            res.status(200).json(regions);
        } catch (err) {
            res.status(500).json({error: err.message});
        }
    }

    async postProduct(req, res, next) {
        console.log('postProduct ');

        try {
            const {productName, tradeType, price, description, category, isTemporary, region, productId} = req.body;
            const uploadTime = +new Date();
            const userId = req.user.id;
            const uploadFiles = [];
            let imageUrls = [];
            let deletedImages = [];

            // 삭제된 이미지 처리
            if (req.body.deletedImages) {
                // const deletedImages = JSON.parse(req.body.deletedImages);
                deletedImages = JSON.parse(req.body.deletedImages);
                console.log('DELETE 1 : ', deletedImages);
                if (deletedImages.length > 0) {
                    try {
                        await this.googleDriveService.deleteFile(deletedImages, process.env.GOOGLE_DRIVE_PRODUCTS_IMAGE); // Google Drive에서 삭제
                    } catch (error) {
                        console.error(`이미지 삭제 실패: ${deletedImages}`, error);
                    }
                }
            }

            if (!req.files || req.files.length < 1) {
                return res.status(400).json({error: '업로드 할 이미지가 없습니다.'});
            }

            // 파일 업로드
            const uploadPromises = req.files.map(async (file) => {
                try {
                    const uploadFileName = userId + '-' + uploadTime + '-' + file.originalname;
                    uploadFiles.push(uploadFileName);
                    return await this.googleDriveService.uploadFile(file.path, uploadFileName, process.env.GOOGLE_DRIVE_PRODUCTS_IMAGE);
                } catch (uploadError) {
                    console.error(`파일 업로드 실패: ${file.filename}`, uploadError);
                    throw new Error('파일 업로드 중 오류가 발생했습니다.');
                } finally {
                    fs.unlinkSync(file.path);
                }
            });

            // 업로드된 이미지 URL들
            imageUrls = await Promise.all(uploadPromises);

            // 상품 등록
            const newProduct = await this.productService.updateOrCreateProduct({
                _id: productId,
                fileUrls: imageUrls,
                name: productName,
                price,
                description,
                category,
                seller: userId,
                writeStatus: isTemporary ? '임시저장' : '등록',
                transactionType: (tradeType === 'sale' ? '판매' : '나눔'),
                status: isTemporary ? '임시저장' : '판매중',
                region, //
                fileNames: uploadFiles,
                deletedImages,
            });

            return res.status(201).json({message: '상품 등록 성공', product: newProduct});

        } catch (err) {
            next(err); // 글로벌 에러 핸들러로 전달
        }
    }

    // 상품 목록 가져오기
    async getProducts(req, res, next) {
        console.log('getProduct ');

        // 필터 조건: 지역, 카테고리
        // 유저는 필터 조건을 보내지 않을 수도 있으므로(전체 조회) req.params가 아닌 req.query 사용
        // 요청 URL: seller_re_backend/posts?level1=경기도&level2=인천&category=도서
        const {level1, level2, category} = req.query;
        console.log('level1: ', level1, '\tlevel2: ', level2, '\tcategory: ', category);

        try {
            const products = await this.productService.getProducts(level1, level2, category);
            return res.status(201).json({message: '상품 목록 조회 성공', products: products});
        } catch (err) {
            next(err); // 글로벌 에러 핸들러로 전달
        }
    }

    async getTempPostProduct(req, res) {
        try {
            const userId = req.user.id;
            console.log('getTempPostProduct ');
            console.log('userId : ', userId);
            const tempPost = await this.productService.getTempPostProductByUserId(userId);
            console.log('getTempPost', tempPost);

            if (tempPost === null) {
                return res.status(404).json({message: '임시 작성된 글이 없습니다.'});
            }
            return res.status(200).json(tempPost);
        } catch (err) {

        }
    }

    //임시 저장글 삭제
    async deleteTempPostProduct(req, res) {
        try {
            const userId = req.user.id;
            const tempPostProduct = await this.productService.getTempPostProductByUserId(userId);
            if (!tempPostProduct) {
                console.log('임시저장된 글이 없음.');
                return res.status(404).json({message: "임시 저장된 글이 없음"})
            }
            console.log('임시저장글 삭제. ', tempPostProduct);

            if (tempPostProduct.fileUrls && tempPostProduct.fileUrls.length > 0) {
                await this.googleDriveService.deleteFile(tempPostProduct.fileUrls, process.env.GOOGLE_DRIVE_PRODUCTS_IMAGE);
            }

            return await this.productService.deletePostProduct(userId, tempPostProduct._id, "임시저장") ?
                res.status(204) : res.status(404).json({message: "삭제할 데이터 없음"});
        } catch (err) {
            console.error(err);
            return res.status(500).json({error: err.message});
        }
    }

    // 상품 상세 가져오기
    async getDetailedProduct(req, res, next) {
        console.log('getDetailedProduct ');

        try {
            const detailedProduct = await this.productService.getDetailedProduct(req.params.id);
            return res.status(200).json({message: '상품 상세 조회 성공', detailedProduct: detailedProduct});
        } catch (err) {
            next(err); // 글로벌 에러 핸들러로 전달
        }
    }

    // 로그인된 회원 판매 상품 조회
    async getUserSales(req, res) {
        try {
            const userId = req.user.id;
            const products = await this.productService.fetchUserSales(userId);
            res.status(200).json(products);
        } catch (err) {
            console.error("판매 상품 조회 오류", err);
            res.status(500).json({message: "서버 오류", error: err.message});
        }
    }
}

module.exports = {ProductController};