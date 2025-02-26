const path = require("path");
const fs = require("fs");
const {google} = require("googleapis");

class GoogleDriveService {
    constructor() {
        this.KEYFILEPATH = path.join(__dirname, '../config/seller-re-8433cca61115.json');
        this.SCOPES = ["https://www.googleapis.com/auth/drive.file"];    // 애플리케이션이 생성한 파일만 관리 가능
        // this.SCOPES = ["https://www.googleapis.com/auth/drive"];    // 모든 파일을 읽기, 삭제, 수정 가능

        this.googleAuth = new google.auth.GoogleAuth({
            keyFile: this.KEYFILEPATH,
            scopes: this.SCOPES,
        });

        // 인증 완료후에 할당
        this.drive = null;
    }

    async authenticate() {
        if (!this.drive) {
            try {
                const authClient = await this.googleAuth.getClient();
                console.log('Authenticated as:', authClient.email);

                console.log(`🛠️ 설정된 OAuth 권한 범위(Scope): ${this.googleAuth.scopes}`);

                this.drive = google.drive({ version: "v3", auth: authClient }); // 인증 후 할당
            } catch (err) {
                console.error('Error during authentication:', err);
                throw new Error('Authentication failed');
            }
        }
    }


    async uploadFile(filePath, fileName, googleDrivefolderPath) {
        try {
            // 인증 먼저 수행
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

    async deleteFile(filePaths, googleDrivefolderPath) {
        //filePaths 배열 형태로 받음
        //googleDrivefolderPath 폴더위치
        try {
            await this.authenticate();

            console.log('Deleting file:', filePaths);
            console.log('path', googleDrivefolderPath);
            
            // Google Drive API에서 제공하는 파일 목록 조회 API
            const response = await this.drive.files.list({
                q: `'${googleDrivefolderPath}' in parents and trashed=false`,
                fields: "files(id, name)",
            });
            
            const folderFiles = response.data.files;
            if (!folderFiles.length) {
                console.log('No files found.');
                return;
            }

            // 폴더 내 파일 목록
            // folderFiles.forEach(file => console.log(` - ${file.name} (${file.id})`));
            
            for (const filePath of filePaths){
                const fileId = this.extractFileIdFromUrl("https://drive.google.com/uc?id="+filePath);

                // //권한은 owner 확인
                // const fileMetadata = await this.drive.files.get({
                //     fileId: fileId,
                //     fields: "id, name, owners, permissions"
                // });
                // console.log(`파일 이름: ${fileMetadata.data.name}`);
                // console.log(`파일 소유자: ${fileMetadata.data.owners.map(owner => owner.emailAddress).join(", ")}`);
                // console.log(`파일 권한 목록:`, fileMetadata.data.permissions);
                
                if (!fileId){
                    console.warn(`wrong  url. ${filePath}`);
                    continue;
                }
                
                const fileInFolder = folderFiles.find(file => file.id === fileId);
                if (fileInFolder) {
                    await this.drive.files.delete({fileId});
                    console.log('delete completely. ', fileInFolder.name);
                }else{
                    console.warn('cant delete. not exists in folder. ', fileId);
                }
            }

        } catch (err) {
            console.error('GoogleDrive. 파일 삭제중 에러. ', err);
            throw new Error('Google Drive Service Error[deleteFile]');
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
