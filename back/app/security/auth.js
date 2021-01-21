import jwt from 'jsonwebtoken';

function login(user) {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            username: user.username,
            skin: user.skin
        },
        process.env.JWT_TOKEN_SECRET,
        {
            expiresIn: '24h'
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
            return res.status(401).send('Unauthorized.');
        }

        req.user = user;
        next();
    });
}

function getUserFromToken(token) {
    /** @type {any} */
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    return {
        _id: decoded._id,
        email: decoded.email,
        username: decoded.username,
        skin: decoded.skin
    }
}

export { login, authenticate, getUserFromToken };
