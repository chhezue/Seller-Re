const multer = require('multer');
const path = require('path');

//허용할 확장자
const allowedExtensions = ['.jpg', '.png', '.jpeg', '.gif'];

class UploadMiddleware {
    constructor() {
        this.upload = multer({
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, path.join(__dirname, '../uploads'));  // 저장 폴더
                },
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                    cb(null, uniqueSuffix + "-" + file.originalname);
                },
            }),
            limits: {
                fileSize: 50 * 1024 * 1024,    // 50mb
            },
            fileFilter: (req, file, cb) => {
                const ext = path.extname(file.originalname).toLowerCase();
                if (!allowedExtensions.includes(ext)) {
                    return cb(new Error(`허용되지 않는 확장자입니다. ${ext}`), false);
                }
                cb(null, true);
            },
        });
    }
}

module.exports = {UploadMiddleware};