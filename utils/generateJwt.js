const jwt = require('jsonwebtoken');

module.exports = async(data) => {
    const token = await jwt.sign(data,process.env.JWT_SECRET_KEY,{expiresIn:"1m"})
    return token;
}