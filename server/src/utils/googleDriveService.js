const path = require("path");
const fs = require("fs");
const {google} = require("googleapis");

// Scope	설명
// https://www.googleapis.com/auth/drive.file	 사용자가 API로 업로드한 파일만 접근 가능 
// https://www.googleapis.com/auth/drive	 드라이브 전체 읽기/쓰기 가능 
// https://www.googleapis.com/auth/drive.readonly	 모든 파일 읽기만 가능
// https://www.googleapis.com/auth/drive.appdata	 앱 전용 데이터 폴더 접근 가능

class GoogleDriveService {
    constructor() {
        this.KEYFILEPATH = path.join(__dirname, '../config/seller-re-ade8bf3515fb.json');
        this.SCOPES = ["https://www.googleapis.com/auth/drive.file"];

        this.googleAuth = new google.auth.GoogleAuth({
            keyFile: this.KEYFILEPATH,
            scopes: this.SCOPES,
        });

        this.drive = google.drive({version: 'v3', auth: this.googleAuth});
    }

    async uploadFile(filePath, fileName) {
        try {
            const fileMetadata = {
                name: fileName,
                parents: ['18nkgajwbBNJNobmKqViuzpmCSIrqsko5'],    // googleDrive 폴더id
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

            //파일을 공개로 설정. url로 접근 가능
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

module.exports = {GoogleDriveService};