const {JwtUtils} = require('../../utils/jwtUtils');
const {authEventEmitter} = require('../../utils/authEventEmitter'); //이때 singleton 처럼 한번만 생성되어 작동

class AuthMiddleware {
    constructor() {
        this.jwtUtils = new JwtUtils();
    }

    authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token){
            authEventEmitter.emit('tokenError', { message: 'No token provided', ip: req.ip });
            return res.status(401).json({message: 'No token provided'});
        }

        try{
            req.user = this.jwtUtils.verifyAccessToken(token);
            return next();
        }catch (err){
            if (err.name === 'TokenExpiredError') {
                authEventEmitter.emit('tokenExpired', { message: 'Token expired', ip: req.ip });
                // accessToken 은 만료되었지만 refreshToke 확인(userController 에서 확인함)
                return next();
            }
            authEventEmitter.emit('tokenError', { message: 'Invalid or expired token', ip: req.ip });
            return res.status(403).json({message: 'Invalid or expired token'});
        }
    }
}


module.exports = {AuthMiddleware};