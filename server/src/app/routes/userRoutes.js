const express = require('express');
const { UserController } = require('../controllers/userController');
const { AuthMiddleware } = require('../middlewares/authMiddleware');

class UserRoutes {
    constructor() {
        this.router = express.Router();
        this.userController = new UserController();
        this.authMiddleware = new AuthMiddleware();
        this.initializeRoutes();
    }

    initializeRoutes() {
        // Public routes
        /**
         * @route   GET /api/users
         * @desc    모든 사용자 목록 조회
         * @access  Public
         */
        this.router.get('/',
            this.userController.getUsers.bind(this.userController)
        );

        /**
         * @route   POST /api/users
         * @desc    새로운 사용자 생성 (회원가입)
         * @access  Public
         */
        this.router.post('/',
            this.userController.createUser.bind(this.userController)
        );

        /**
         * @route   POST /api/users/login
         * @desc    사용자 로그인
         * @access  Public
         */
        this.router.post('/login',
            this.userController.loginUser.bind(this.userController)
        );

        /**
         * @route   POST /api/users/refresh
         * @desc    토큰 새로고침
         * @access  Public
         */
        this.router.post('/refresh',
            this.userController.refresh.bind(this.userController)
        );

        /**
         * @route   GET /api/users/randomUser
         * @desc    랜덤 사용자 정보 조회
         * @access  Public
         */
        this.router.get('/randomUser',
            this.userController.getRandomUser.bind(this.userController)
        );

        // Protected routes (인증 필요)
        /**
         * @route   POST /api/users/logout
         * @desc    사용자 로그아웃
         * @access  Private
         */
        this.router.post('/logout',
            this.authMiddleware.authenticateToken.bind(this.authMiddleware),
            this.userController.logout.bind(this.userController)
        );

        /**
         * @route   GET /api/users/auth
         * @desc    현재 인증된 사용자 정보 조회
         * @access  Private
         */
        this.router.get('/auth',
            this.authMiddleware.authenticateToken.bind(this.authMiddleware),
            (req, res) => {
                res.json({ user: req.user });
            }
        );
    }
}

module.exports = { UserRoutes };
