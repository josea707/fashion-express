const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req,res,next) {
    // Get token from header
    const auth = req.header('Authorization');
    // check if not token
    // 401: unathorized
    if(!auth)
    {
        return res.status(401).json({msg: 'No token, authorization denied'});
    }
    try {
        const token = auth.slice(7, auth.length); // Bearer XXXXXX
        // we have a token but we have to verify it.
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({msg:'Token is not valid'});
    }
}