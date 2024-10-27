const { models } = require("mongoose")
const AppError = require('../../utils/errorHandel');
module.exports =  (...roles) =>      {
    console.log('roles :' , roles)
    
        return (req,res,next) => {
            if(!roles.includes(req.currentUser.role)){
                 return next(AppError.create('role is not authorized',401))
            }
            next();
    }
} 
