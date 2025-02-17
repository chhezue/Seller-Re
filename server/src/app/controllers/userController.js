const {UserService} = require('../services/userService');
const User = require("../models/User");

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

    async loginUser(req, res) {
        console.log('loginUser : ', req.body);   // 여기까진 성공
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

            res.status(200).json({user, accessToken});  //TODO. user 전부 반환이 아니라 userid, username, role, profileImage만 리턴시켜주기
        } catch (err) {
            console.log(err.message);
            console.log(err)
            res.status(500).json({error: err.message});
        }
    }

    async refresh(req, res) {
        try {
            console.log(`${new Date()} 쿠키 확인 : `,req.cookies);
            // console.log(new Date(), '쿠키 확인 : ', req.cookies);

            const { refreshToken } = req.cookies;
            if (!refreshToken) {
                return res.status(401).json({ message: "No refresh token provided" });
            }

            const newAccessToken = await this.userService.verifyAndRefreshToken(refreshToken);
            res.json({ accessToken: newAccessToken }); 
        } catch (err) {
            console.log("Refresh token error:", err);
            res.status(403).json({ message: "Invalid refresh token" });
        }
    }

    
    async logout(req, res) {
        //로그아웃 상황
        //1. accessToken 유효. 로그아웃 성공
        //2. accessToken 만료, refreshToken 있음. 로그아웃 성공.
        //3. accessToken 만료, refreshToken 없음. 로그아웃 실패 401 에러.

        console.log('logout');
        console.log(req.cookies);
        
        try{
            const {refreshToken} = req.cookies;
            // user 정보와 refreshToken 이 있어야 함
            if (!req.user && !refreshToken) {
                return res.status(401).json({message : 'No valid session'});
            }
            res.clearCookie('refreshToken');
            return res.status(200).json({message:'logout'});
        }catch (err){
            res.status(400).json({message : 'Logout failed'});
        }
    }

    // 로그인 시 랜덤 유저 가져오기
    async getRandomUser(req, res) {
        try {
            console.log("getRandomUser 함수 시작");
            // 전체 유저 수 가져오기
            const userCount = await User.countDocuments();
            console.log("userCount: ",userCount)
            if (userCount === 0) {
                return res.status(404).json({ message: "유저 없음" });
            }

            // 랜덤 인덱스 생성
            const randomIndex = Math.floor(Math.random() * userCount);

            // 해당 인덱스에서 유저 한 명 가져오기
            const randomUser = await User.findOne().skip(randomIndex);

            if (!randomUser) {
                return res.status(404).json({ message: "유저를 찾을 수 없음" });
            }

            console.log("랜덤으로 가져온 유저:", randomUser);
            res.json({ userId: randomUser.userid, userPassword: randomUser.password });
        } catch (error) {
            console.error("랜덤 유저 조회 오류:", error);
            res.status(500).json({ message: "서버 오류", error: error.message });
        }
    }

}

module.exports = {UserController};
