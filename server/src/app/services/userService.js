const User = require('../models/User');

class UserService {
    async fetchAllUsers() {
        return await User.find();
    }

    async addUser(userData) {
        const existingUser = await User.findOne({userid : userData.id});
        if (existingUser) {
            console.log(`existingUser: ${existingUser}`);
            throw new Error(`User with id ${existingUser.id} already exists`);
        }
        const user = new User(userData);
        return await user.save();
    }

    async authenticateUser(userId, userPassword) {
        const user = await User.findOne({userid: userId});
        console.log(`authenticateUser: ${JSON.stringify(user)}`);
        if (!user) {
            return null;
        }
        return user;   
    }
}

module.exports = {UserService};
