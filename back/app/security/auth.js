import jwt from 'jsonwebtoken';

function login(user) {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            username: user.username,
            skin: user.skin
        },
        process.env.JWT_TOKEN_SECRET,
        {
            expiresIn: '20m'
        });
}

function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token === null) {
        return res.status(401).send('No token detected!');
    }

    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Unauthorized.')
        }

        req.user = user;
        next();
    });
}

function getUserFromToken(token) {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

        return {
            email: decoded.email,
            username: decoded.username
        }
}

export { login, authenticate, getUserFromToken };
