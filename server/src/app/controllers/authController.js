const { AuthService } = require('../services/authService');

/**
 * [JWT controller]
 *
 * 역할:
 * - 로그인 요청 처리 및 토큰 발급 (login 메서드)
 *   - 사용자 정보 검증 후 AuthService를 통해 액세스/리프레시 토큰 생성
 *   - 리프레시 토큰은 HTTP-only 쿠키로 설정
 *   - 액세스 토큰은 응답 본문에 포함
 *
 * - 토큰 갱신 요청 처리 (refresh 메서드)
 *   - 쿠키에서 리프레시 토큰 추출
 *   - AuthService를 통해 새 액세스 토큰 발급
 *
 * - 로그아웃 처리 (logout 메서드)
 *   - 리프레시 토큰 쿠키 제거
 */

// 요청 및 응답 처리
class AuthController {
    constructor() {
        this.authService = new AuthService();
    }

    // 로그인 및 토큰 발급
    async login(req, res) {
        try {
            const { userId, userPassword } = req.body;
            const { user, accessToken, refreshToken } = await this.authService.login(userId, userPassword);

            // http-only 형식으로 리프레시 토큰 설정
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            // 액세스 토큰은 응답으로 보냄
            res.json({ user, accessToken });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }

    // 액세스 토큰 갱신
    async refresh(req, res) {
        try {
            const { refreshToken } = req.cookies;
            const accessToken = await this.authService.refreshToken(refreshToken);
            res.json({ accessToken });
        } catch (error) {
            res.status(403).json({ message: error.message });
        }
    }

    // 로그아웃 및 토큰 삭제
    async logout(req, res) {
        try {
            res.clearCookie('refreshToken');
            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = { AuthController };
