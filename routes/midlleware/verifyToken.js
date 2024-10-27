const jwt = require('jsonwebtoken');
const httpStatusText = require('../../utils/httpStatustext');
const AppError = require('../../utils/errorHandel');

verifyToken = (req,res,next) => {
    const AuthHeader = req.headers['Authorization'] || req.headers['authorization'];
    if(!AuthHeader){
        const error = AppError.create('Token is required',401,httpStatusText.FAIL);
        return next(error);
    }
    const token = AuthHeader.split(' ')[1];
    try{
    const currentUser = jwt.verify(token,process.env.JWT_SECRET_KEY);
    console.log('currentUser' , currentUser);
    req.currentUser = currentUser;
    next();
    }
    catch(err){
        const error = AppError.create('Token is not valid',401,httpStatusText.FAIL);
        return next(error);
    }    
};

module.exports = verifyToken;

