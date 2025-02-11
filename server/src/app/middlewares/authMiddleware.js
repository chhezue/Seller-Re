const {EventEmitter} = require('events');
const {JwtUtils} = require('../../utils/jwtUtils');


class AuthMiddleware {
    constructor() {
        this.jwtUtils = new JwtUtils();
    }
    
    authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token){
            return res.status(401).json({message: 'No token provided'});
        }
        
        try{
            req.user = this.jwtUtils.verifyAccessToken(token);
            return next();
        }catch (err){
            if (err.name === 'TokenExpiredError') {
                // accessToken 은 만료되었지만 refreshToke 확인(userController 에서 확인함)
                return next();
            }
            return res.status(403).json({message: 'Invalid or expired token'});
        }
    }
}


module.exports = {AuthMiddleware};
