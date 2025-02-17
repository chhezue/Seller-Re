const path = require("path");
const fs = require("fs");
const { google } = require("googleapis");

class GoogleDriveService {
    constructor() {
        this.KEYFILEPATH = path.join(__dirname, '../config/seller-re-8b621690cadb.json');
        this.SCOPES = ["https://www.googleapis.com/auth/drive.file"];

        this.googleAuth = new google.auth.GoogleAuth({
            keyFile: this.KEYFILEPATH,
            scopes: this.SCOPES,
        });

        this.drive = google.drive({ version: 'v3', auth: this.googleAuth });
    }

    async authenticate() {
        try {
            const authClient = await this.googleAuth.getClient();
            console.log('Authenticated as:', authClient.email);
            return authClient;
        } catch (err) {
            console.error('Error during authentication:', err);
            throw new Error('Authentication failed');
        }
    }

    async uploadFile(filePath, fileName) {
        try {
            // 인증 확인
            await this.authenticate();

            const fileMetadata = {
                name: fileName,
                parents: ['18nkgajwbBNJNobmKqViuzpmCSIrqsko5'],    // Google Drive 폴더 ID
            };

            const media = {
                originalMediaType: 'image/jpeg',
                body: fs.createReadStream(filePath),
            };

            const response = await this.drive.files.create({
                resource: fileMetadata,
                media: media,
                fields: 'id',
            });

            // 파일을 공개로 설정하여 URL로 접근 가능하게 하기
            await this.drive.permissions.create({
                fileId: response.data.id,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });

            // 업로드된 파일의 URL 반환
            return `https://drive.google.com/uc?id=${response.data.id}`;
        } catch (err) {
            console.error('Google Drive Upload Error:', err);
            throw new Error('Google Drive Service upload Error');
        }
    }
}

module.exports = { GoogleDriveService };
