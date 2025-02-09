const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH = process.env.JWT_REFRESH;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

class JwtUtils {
    constructor() {
    }

    generateAccessToken(user) {
        //jwt access token 발급
        // 이 토큰은 사용자가 로그인하면 생성되어 클라이언트에서 사용됨
        return jwt.sign(
            {
                id: user.id,
                username: user.username,
            }, JWT_SECRET,
            {
                expiresIn: JWT_EXPIRES_IN,
            });
    }

    generateRefreshToken(user) {
        //jwt refresh token 발급
        // 액세스 토큰이 만료될 경우, 이 토큰을 사용해 새로운 액세스 토큰을 발급받음
        return jwt.sign(
            {
                id: user.id,
                username: user.username,
            }, JWT_REFRESH,
            {
                expiresIn: JWT_REFRESH_EXPIRES_IN,
            });
    }

    verifyAccessToken(token) {
        //jwt access token 검증
        // 클라이언트에서 요청할 때 이 토큰이 유효한지 확인함
        return jwt.verify(token, JWT_SECRET);
    }

    verifyRefreshToken(token) {
        //jwt refresh token 검증
        // 유효한 리프레시 토큰인지 확인하고, 이를 기반으로 새로운 액세스 토큰을 발급함.
        return jwt.verify(token, JWT_REFRESH);
    }
}

module.exports = {JwtUtils};