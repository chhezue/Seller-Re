class AuthMiddleware {
    authenticate(req, res, next) {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Token 검증 로직 추가 (JWT 등)
        next();
    }
}

module.exports = {AuthMiddleware};
