const path = require("path");
const fs = require("fs");
const {google} = require("googleapis");

class GoogleDriveService {
    constructor() {
        this.KEYFILEPATH = path.join(__dirname, '../config/seller-re-8433cca61115.json');
        this.SCOPES = ["https://www.googleapis.com/auth/drive.file"];

        this.googleAuth = new google.auth.GoogleAuth({
            keyFile: this.KEYFILEPATH,
            scopes: this.SCOPES,
        });

        this.drive = google.drive({version: 'v3', auth: this.googleAuth});
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


    async uploadFile(filePath, fileName, googleDrivefolderPath) {
        try {
            // 인증 확인
            await this.authenticate();

            const fileMetadata = {
                name: fileName,
                parents: [googleDrivefolderPath],    // Google Drive 폴더 ID
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

    async deleteFile(filePaths, folder_id) {
        const drive = google.drive({version: 'v3', auth: this.googleAuth});

        try {
            for (const url of filePaths) {
                const fileId = this.extractFileIdFromUrl(url);
                if (fileId) {
                    await drive.files.delete({fileId});
                }
            }
        } catch (err) {
            console.error('GoogleDrive. 파일 삭제중 에러. ', err);
        }
    }

    async getFileNameFromDrive(url) {
        const fileId = this.extractFileIdFromUrl(url);
        if (!fileId) {
            return null;
        }

        try {
            const response = await this.drive.files.get({
                fileId: fileId,
                fields: 'name'
            });

            return response.data.name;
        } catch (err) {
            console.error('GoogleDrive. 파일명 가져오는중 에러. ', err)
        }
    }

    extractFileIdFromUrl(url) {
        const regex = /(?:https?:\/\/drive\.google\.com\/.*?id=)([\w-]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }
}

module.exports = {GoogleDriveService};
