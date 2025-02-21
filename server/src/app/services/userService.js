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
        const existingUser = await User.findOne({userid: userData.id});
        if (existingUser) {
            console.log(`existingUser: ${existingUser}`);
            throw new Error(`User with id ${existingUser.id} already exists`);
        }
        const user = new User(userData);
        return await user.save();
    }

    async authenticateUser(userId, userPassword) {
        // const user = await User.findOne({userid : userId});
        const user = await User.findOne({userid: userId, password: userPassword}).populate("region", "level2");
        console.log("🔍 인증된 사용자 정보:", user);
        if (!user) {
            return null;
        }

        //TODO. 비밀번호 bcrypt 사용하여 검증
        //code...

        return user;
    }

    async generateToken(user) {
        const accessToken = this.jwtUtils.generateAccessToken(user);
        const refreshToken = this.jwtUtils.generateRefreshToken(user);

        //refreshToken을 DB에 저장
        await User.updateOne({_id: user._id}, {refreshToken: refreshToken})

        return {accessToken, refreshToken};
    }
    
    async verifyAndRefreshToken(refreshToken){
        const userData = this.jwtUtils.verifyRefreshToken(refreshToken);
        const user = await User.findOne({_id: userData.id, refreshToken})
        
        if (!user) {
            throw new Error(`User with id ${userData.id} does not exist`);
        }
        return this.jwtUtils.generateAccessToken(user);
    }

    // 랜덤 유저 가져오기
    async fetchRandomUser() {
        try {
            // 전체 유저 수 확인
            const userCount = await User.countDocuments();
            if (userCount === 0) throw new Error("사용자 없음")

            // 해당 인덱스에서 유저 한 명 가져오기
            const randomIndex = Math.floor(Math.random() * userCount);
            const randomUser = await User.findOne().skip(randomIndex);
            if (!randomUser) throw new Error("사용자를 찾을 수 없음");
            console.log("serviece randomUser", randomUser)
            return { userId: randomUser.userid, userPassword: randomUser.password };
        } catch (error) {
            console.error("랜덤 유저 조회 오류:", error);
            throw error;
        }
    }

}

module.exports = {UserService};
