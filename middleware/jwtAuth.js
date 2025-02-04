const jwt = require('jsonwebtoken');

function verifyToken(request, response, next) {
    const authHeader = request.headers.authorization || request.headers.Authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
        return response.status(401).json({ message: "Access denied: No token provided" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        request.user_id = decoded.user_id;
        request.email = decoded.email;
        request.isAdmin = decoded.isAdmin;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return response.status(403).json({ message: "Token expired" });
        }
        response.status(401).json({ message: "Invalid token" });
    }
};

module.exports = verifyToken;