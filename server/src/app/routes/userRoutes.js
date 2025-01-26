const express = require('express');
const {UserController} = require('../controllers/userController');

class UserRoutes {
    constructor() {
        this.router = express.Router();
        this.userController = new UserController();
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.router.get('/', this.userController.getUsers.bind(this.userController));
        this.router.post('/', this.userController.createUser.bind(this.userController));
    }
}

module.exports = {UserRoutes};
