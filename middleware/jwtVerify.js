const jwt = require('jsonwebtoken');
const env = require('../config');

const jwtkey = env.JWT_KEY;

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, jwtkey);
        req.userData = decoded;
        next();
    } catch (error) {
        res.status(401).send("token is not valid");
    }
};