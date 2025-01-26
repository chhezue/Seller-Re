const User = require('../models/User');

class UserService {
    async fetchAllUsers() {
        return await User.find();
    }

    async addUser(userData) {
        const user = new User(userData);
        return await user.save();
    }
}

module.exports = {UserService};
