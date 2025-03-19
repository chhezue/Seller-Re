const express = require('express');
const { AuthController } = require('../controllers/authController');
const { AuthMiddleware } = require('../middlewares/authMiddleware');

/**
 * [JWT route]
 *
 * 역할:
 * - 인증이 필요한 라우트에 verifyToken 미들웨어 연결
 * - 인증되지 않은 사용자도 접근 가능한 public 라우트와 인증된 사용자만 접근 가능한 protected 라우트 구분
 */

class AuthRoutes {
    constructor() {
        this.router = express.Router();
        this.authController = new AuthController();
        this.authMiddleware = new AuthMiddleware();
        this.initializeRoutes();
    }

    initializeRoutes() {
        // Public routes
        /**
         * @route   POST /api/auth/login
         * @desc    사용자 로그인
         * @access  Public
         */
        this.router.post('/login',
            this.authController.login.bind(this.authController)
        );

        /**
         * @route   POST /api/auth/refresh
         * @desc    액세스 토큰 갱신
         * @access  Public
         */
        this.router.post('/refresh',
            this.authController.refresh.bind(this.authController)
        );

        // Protected routes (인증 필요)
        /**
         * @route   POST /api/auth/logout
         * @desc    사용자 로그아웃
         * @access  Private
         */
        this.router.post('/logout',
            this.authMiddleware.verifyToken.bind(this.authMiddleware),
            this.authController.logout.bind(this.authController)
        );

        /**
         * @route   GET /api/auth/me
         * @desc    현재 인증된 사용자 정보 조회
         * @access  Private
         */
        this.router.get('/me',
            this.authMiddleware.verifyToken.bind(this.authMiddleware),
            (req, res) => {
                res.json({ user: req.user });
            }
        );
    }
}

module.exports = { AuthRoutes }; 