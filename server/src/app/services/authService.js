const User = require('../models/User');
const { JwtUtils } = require('../../utils/JwtUtils');

/**
 * [JWT service]
 *
 * 역할:
 * - 사용자 로그인 인증 및 토큰 생성 (login 메서드)
 *   - 사용자 ID/비밀번호 검증
 *   - JwtUtils를 통해 액세스/리프레시 토큰 생성
 *   - 생성된 리프레시 토큰을 사용자 정보와 함께 DB에 저장
 *   - 생성된 액세스 토큰은 응답으로 반환
 *
 * - 리프레시 토큰을 통한 액세스 토큰 갱신 (refreshToken 메서드)
 *   - 리프레시 토큰 유효성 검증
 *   - 토큰과 일치하는 사용자 DB 조회
 *   - 새로운 액세스 토큰 발급
 */

class AuthService {
    constructor() {
        this.jwtUtils = new JwtUtils();
    }

    async login(userId, userPassword) {
        const user = await User.findOne({ 
            userid: userId, 
            password: userPassword 
        }).populate('region', 'level2');

        // TODO. bcrypt를 이용한 비밀번호 검증

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const accessToken = this.jwtUtils.generateAccessToken(user);
        const refreshToken = this.jwtUtils.generateRefreshToken(user);

        await User.updateOne(
            { _id: user._id }, 
            { refreshToken } // 리프레시 토큰 db에 저장
        );

        return {
            user: {
                id: user._id,
                userId: user.userid,
                username: user.username,
                profileImage: user.profileImage,
                region: user.region.level2
            },
            accessToken,
            refreshToken
        };
    };

    async refreshToken(refreshToken) {
        const userData = this.jwtUtils.verifyRefreshToken(refreshToken);
        const user = await User.findOne({
            _id: userData.id,
            refreshToken
        });

        if (!user) {
            throw new Error('Invalid refresh token');
        }

        return this.jwtUtils.generateAccessToken(user);
    }
}

module.exports = { AuthService };
