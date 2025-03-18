const { JwtUtils } = require('../../utils/jwtUtils');
const User = require('../models/User');

class AuthService {
    constructor() {
        this.jwtUtils = new JwtUtils();
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
}

module.exports = { AuthService };
