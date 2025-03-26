const bcrypt = require('bcrypt');

class PasswordUtils {
    // 회원가입이나 비밀번호 변경 시 비밀번호 해시 처리
    static async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    // db에 저장된 비밀번호와 input으로 들어온 비밀번호 비교
    static async verifyPassword(inputPassword, hashedPassword) {
        return await bcrypt.compare(inputPassword, hashedPassword);
    }
}

module.exports = { PasswordUtils };