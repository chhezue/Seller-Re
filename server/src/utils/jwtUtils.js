const jwt = require('jsonwebtoken');

/**
 * [JWT utility]
 *
 * 역할:
 * - 액세스 토큰 생성 (generateAccessToken 메서드)
 *   - 사용자 ID와 이름을 포함한 토큰 발급
 *   - JWT_SECRET 환경 변수로 서명
 *   - JWT_EXPIRES_IN 환경 변수로 만료 시간 설정
 *
 * - 리프레시 토큰 생성 (generateRefreshToken 메서드)
 *   - 사용자 ID와 이름을 포함한 토큰 발급
 *   - JWT_REFRESH 환경 변수로 서명
 *   - JWT_REFRESH_EXPIRES_IN 환경 변수로 더 긴 만료 시간 설정
 *
 * - 액세스 토큰 검증 (verifyAccessToken 메서드)
 *   - JWT_SECRET으로 서명된 토큰 유효성 검증
 *   - 검증 성공 시 토큰의 페이로드 반환
 *
 * - 리프레시 토큰 검증 (verifyRefreshToken 메서드)
 *   - JWT_REFRESH로 서명된 토큰 유효성 검증
 *   - 검증 성공 시 토큰의 페이로드 반환
 */

class JwtUtils {
    constructor() {
        this.jwt = jwt;
        //아니!! process.env.JWT_SECRET 일때에는 secretOrPrivateKey must have a value 가 발생함
        this.JWT_SECRET = `${process.env.JWT_SECRET}`;
        this.JWT_REFRESH = `${process.env.JWT_REFRESH}`;
        this.JWT_EXPIRES_IN = `${process.env.JWT_EXPIRES_IN}`;
        this.JWT_REFRESH_EXPIRES_IN = `${process.env.JWT_REFRESH_EXPIRES_IN}`;
    }

    generateAccessToken(user) {
        // jwt access token 발급
        // 이 토큰은 사용자가 로그인하면 생성되어 클라이언트에서 사용됨
        return this.jwt.sign(
            {
                id: user.id,
                username: user.username,
            }, this.JWT_SECRET,
            {
                expiresIn: this.JWT_EXPIRES_IN,
            });
    }

    generateRefreshToken(user) {
        // jwt refresh token 발급
        // 액세스 토큰이 만료될 경우, 이 토큰을 사용해 새로운 액세스 토큰을 발급받음
        return this.jwt.sign(
            {
                id: user.id,
                username: user.username,
            }, this.JWT_REFRESH,
            {
                expiresIn: this.JWT_REFRESH_EXPIRES_IN,
            });
    }

    verifyAccessToken(token) {
        // jwt access token 검증
        // 클라이언트에서 요청할 때 이 토큰이 유효한지 확인함
        // console.log('verifyAccessToken', token);
        return this.jwt.verify(token, this.JWT_SECRET); // 페이로드 반환
    }

    verifyRefreshToken(token) {
        // jwt refresh token 검증
        // 유효한 리프레시 토큰인지 확인하고, 이를 기반으로 새로운 액세스 토큰을 발급함.
        return this.jwt.verify(token, this.JWT_REFRESH); // 페이로드 반환
    }
}

module.exports = {JwtUtils};