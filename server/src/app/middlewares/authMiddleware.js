const { JwtUtils } = require('../../utils/JwtUtils');
const { authEventEmitter } = require('../../utils/authEventEmitter');

/**
 * [JWT middleware]
 *
 * 역할:
 * - verifyToken 메서드를 통해 요청 헤더의 Authorization 토큰 추출
 *  - 토큰 누락 시 401 Unauthorized 응답 반환
 *
 * - jwtUtils를 사용하여 액세스 토큰 유효성 검증
 *  - 유효한 토큰일 경우 토큰에서 사용자 정보 추출하여 req.user에 저장
 *  - 만료된 토큰일 경우 'tokenExpired' 이벤트 발생 후 다음 미들웨어로 진행(이후 토큰 갱신 가능하도록)
 *  - 유효하지 않은 토큰일 경우 403 Forbidden 응답 반환
 *  - 토큰 관련 오류 발생 시 이벤트 발생하여 로깅
 */

class AuthMiddleware {
    constructor() {
        this.jwtUtils = new JwtUtils();
    }
    
    verifyToken(req, res, next) {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            authEventEmitter.emit('tokenError', { message: 'No token provided', ip: req.ip });
            return res.status(401).json({ message: 'No token provided' });
        }

        try {
            // 반환된 페이로드를 req.user에 삽입
            // req.user: 서버에서 사용자 인증이 완료된 후 해당 사용자의 정보(페이로드)를 저장하는 부분
            req.user = this.jwtUtils.verifyAccessToken(token);
            next();
        } catch (error) {
            // 만료된 토큰일 경우
            if (error.name === 'TokenExpiredError') {
                authEventEmitter.emit('tokenExpired', { message: 'Token expired', ip: req.ip });
                return next();
            }
            // 기타 오류의 경우
            authEventEmitter.emit('tokenError', { message: error.message, ip: req.ip });
            res.status(403).json({ message: 'Invalid token' });
        }
    }
}

module.exports = { AuthMiddleware };