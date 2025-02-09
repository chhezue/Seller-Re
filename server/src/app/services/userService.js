const User = require('../models/User');
const {JwtUtils} = require('../../utils/jwtUtils');

class UserService {
    constructor() {
        this.jwtUtils = new JwtUtils();
    }
    
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

    async generateTokens(user) {
        const accessToken = this.jwtUtils.generateAccessToken(user);
        const refreshToken = this.jwtUtils.generateRefreshToken(user);
        
        return {accessToken, refreshToken};
    }
}

module.exports = {UserService};
