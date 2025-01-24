const {UserService} = require('../services/userService');

class UserController {
    constructor() {
        this.userService = new UserService();
    }

    async getUsers(req, res) {
        try {
            const users = await this.userService.fetchAllUsers();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async createUser(req, res) {
        try {
            const newUser = await this.userService.addUser(req.body);
            res.status(201).json(newUser);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
}
module.exports = {UserController};
