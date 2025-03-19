const {UserService} = require('../services/userService');

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    // 모든 유저 가져오기
    async getUsers(req, res) {
        try {
            const users = await this.userService.fetchAllUsers();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({error: err.message});
        }
    }

    // 회원 가입
    async createUser(req, res) {
        try {
            const newUser = await this.userService.addUser(req.body);
            res.status(201).json(newUser);
        } catch (err) {
            res.status(400).json({error: err.message});
        }
    }

    // 로그인 시 랜덤 유저 가져오기
    async getRandomUser(req, res) {
        try {
            const randomUser = await this.userService.fetchRandomUser();
            console.log("controller randomUser: ", randomUser)
            res.status(200).json(randomUser);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = {UserController};
