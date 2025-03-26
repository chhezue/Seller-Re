class FileService {
    constructor(googleDriveService) {
        this.googleDriveService = googleDriveService;
    }

    async handleProductImages(req) {
        const userId = req.user.id;
        const uploadTime = Date.now();
        let imageUrls = [];
        let deletedImages = [];

        // 삭제할 이미지 처리
        if (req.body.deletedImages) {
            deletedImages = JSON.parse(req.body.deletedImages);
            try {
                await this.googleDriveService.deleteFile(
                    deletedImages, 
                    process.env.GOOGLE_DRIVE_PRODUCTS_IMAGE
                );
            } catch (error) {
                console.error(`이미지 삭제 실패: ${deletedImages}`, error);
            }
        }

        // 업로드할 이미지 처리
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(async (file) => {
                const uploadFileName = `${userId}-${uploadTime}-${file.originalname}`;
                return await this.googleDriveService.uploadFile(
                    file.path, 
                    uploadFileName, 
                    process.env.GOOGLE_DRIVE_PRODUCTS_IMAGE
                );
            });
            imageUrls = await Promise.all(uploadPromises);
        }

        return { imageUrls, deletedImages };
    }
}

module.exports = { FileService };