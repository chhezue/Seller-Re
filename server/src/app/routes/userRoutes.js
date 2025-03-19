const express = require('express');
const { UserController } = require('../controllers/userController');

class UserRoutes {
    constructor() {
        this.router = express.Router();
        this.userController = new UserController();
        this.initializeRoutes();
    }

    initializeRoutes() {
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
         * @route   GET /api/auth/random-user
         * @desc    랜덤 사용자 정보 조회
         * @access  Public
         */
        this.router.get('/random-user',
            this.userController.getRandomUser.bind(this.userController)
        );
    }
}

module.exports = { UserRoutes };
