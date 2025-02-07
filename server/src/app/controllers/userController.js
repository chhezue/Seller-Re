const {UserService} = require('../services/userService');
const jwt = require('jsonwebtoken');

class UserController {
    constructor() {
        this.userService = new UserService();
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

    //로그인 + JWT 발급
    async loginUser(req, res) {
        console.log(`logged in user ${JSON.stringify(req.body)}`);
        try {
            const {userId, userPassword} = req.body;
            const result = await this.userService.authenticateUser(userId, userPassword);
            if (!result) {
                return res.status(401).json({message: 'Invalid Credentials'});
            }
            // JWT 발급 시 사용자 정보(userId, userName 포함)
            const token = jwt.sign(
                {
                    id: result.userId,
                    userName: result.userName  // userName 추가
                },
                process.env.JWT_SECRET,
                {expiresIn: process.env.JWT_EXPIRES}
            );
            console.log('token', token);
            console.log(`userId: ${result.userid}`);
            console.log(`userName: ${result.username}`);
            res.status(200).json({token: token, userId: result.userid, userName: result.username});
        } catch (err) {
            res.status(400).json({error: err.message});
        }
    }


    //JWT 검증 (자동로그인)
    async verifyToken(req, res) {
        console.log("Token verification started...");
        console.log('--------------------------------');
        try {
            const token = req.headers.authorization?.split(' ')[1];  // Bearer <token>
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }

            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    console.log("Token is invalid or expired", err);
                    return res.status(401).json({ message: 'Invalid Token' });
                }
                // 요청 객체에 사용자 정보 추가
                req.user = decoded;
                console.log("Token verified, user info:", decoded);  // 디버깅용 로그
                return res.json({ userId: decoded.id, userName: decoded.userName });
            });
        } catch (error) {
            console.log("Error during token verification", error);
            res.status(500).json({ message: 'Server error' });
        }
    }

}

module.exports = {UserController};
