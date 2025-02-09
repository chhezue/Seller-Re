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
        this.router.post('/logout', this.userController.logout.bind(this.userController));
        this.router.get('/auth', this.authMiddleware.authenticateToken.bind(this.authMiddleware), (req, res) => {
            res.json({ user: req.user });
        });
    }
}


module.exports = { UserRoutes };
