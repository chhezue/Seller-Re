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
        this.router.get('/', this.userController.getUsers.bind(this.userController));
        this.router.post('/', this.userController.createUser.bind(this.userController));

        // 로그인 API (JWT 발급)
        this.router.post("/login", this.userController.loginUser.bind(this.userController));

        // 토큰 검증 API (자동 로그인)
        // this.router.get("/auth", this.authMiddleware.authenticate.bind(this.authMiddleware), this.userController.verifyToken.bind(this.userController));
        this.router.get("/auth", this.authMiddleware.authenticateToken().bind(this.authMiddleware), this.userController.verifyToken.bind(this.userController));
    }
}


module.exports = { UserRoutes };
