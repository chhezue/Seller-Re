const jwt = require('jsonwebtoken');
const {EventEmitter} = require('events');

class AuthMiddleware {
    authenticate(req, res, next) {
        const token = req.headers.authorization?.split(' ')[1];  // "Bearer <TOKEN>" 형식
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log("Token is invalid or expired", err);  // 추가적인 디버그용 로그
                return res.status(401).json({ message: 'Invalid Token' });
            }
            req.user = decoded;  // 요청 객체에 사용자 정보 추가
            next();
        });
    }
}


module.exports = {AuthMiddleware};
