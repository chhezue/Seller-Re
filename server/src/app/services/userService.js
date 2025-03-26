const User = require('../models/User');
const { PasswordUtils } = require('../../utils/PasswordUtils');

class UserService {
    constructor() { }

    async fetchAllUsers() {
        return await User.find();
    }

    async addUser(userData) {
        const existingUser = await User.findOne({userid: userData.id});

        if (existingUser) {
            console.log(`existingUser: ${existingUser}`);
            throw new Error(`User with id ${existingUser.id} already exists`);
        }

        const hashedPassword = await PasswordUtils.hashPassword(userData.password);
        userData.password = hashedPassword;

        const user = new User(userData);
        return await user.save();
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

module.exports = { UserService };
