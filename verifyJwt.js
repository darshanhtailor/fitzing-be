const jwt = require('jsonwebtoken');

const jwtSecret = 'secret';
const verifyJwt = async(req, res, next)=>{
    try {
        const token = req.header('auth-token');
        if(!token){
            throw new Error('Authenticate with valid token');
        }

        const data = jwt.verify(token, jwtSecret);
        req.user = { email: data.email, user_id: data.user_id };
        next();
    } catch (err) {
        res.send({error: err.message});
    }
}

module.exports = verifyJwt;