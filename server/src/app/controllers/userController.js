const {UserService} = require('../services/userService');
const {JwtUtils} = require('../../utils/jwtUtils');

class UserController {
    constructor() {
        this.userService = new UserService();
        this.jwtUtils = new JwtUtils();
    }

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

    async loginUser(req, res) {
        console.log('loginUser');   // 여기까진 성공
        try {
            const {userId, userPassword} = req.body;
            const user = await this.userService.authenticateUser(userId, userPassword);
            if (!user) {
                return res.status(401).json({message: 'Invalid Credentials'});
            }

            const {accessToken, refreshToken} = await this.userService.generateToken(user);

            console.log(`login! ${accessToken}`);
            console.log(`refreshToken=${refreshToken}`);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,  // https - true, http - false
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7d
            });

            res.status(200).json({user, accessToken});
        } catch (err) {
            console.log(err.message);
            console.log(err)
            res.status(500).json({error: err.message});
        }
    }

    async refresh(req, res) {
        try {
            const {refreshToken} = req.cookies;
            if (!refreshToken) {
                return res.status(401).json({message: 'No refresh token provided'});
            }

            const newAccessToken = await this.userService.verifyAndRefreshToken(refreshToken);
            res.json({accessToken: refreshToken});
        } catch (err) {
            res.status(403).json({message : 'Invalid refresh token'});
        }
    }
    
    async logout(req, res) {
        res.clearCookie('refreshToken');
        res.json({message: 'Logged out'});
    }

}

module.exports = {UserController};
