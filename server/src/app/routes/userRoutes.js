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
        this.router.post('/login', this.userController.loginUser.bind(this.userController));
        this.router.post('/refresh', this.userController.refresh.bind(this.userController));
        
        // accessToken이 유효한 경우에만 로그아웃 가능
        // this.router.post('/logout', this.userController.logout.bind(this.userController));
        this.router.post('/logout', this.authMiddleware.authenticateToken.bind(this.authMiddleware), this.userController.logout.bind(this.userController));


        this.router.get('/auth', this.authMiddleware.authenticateToken.bind(this.authMiddleware), (req, res) => {
            res.json({ user: req.user });
        });

        // 랜덤 유저 가져오기
        this.router.get('/randomUser', this.userController.getRandomUser.bind(this.userController));
    }
}


module.exports = { UserRoutes };
