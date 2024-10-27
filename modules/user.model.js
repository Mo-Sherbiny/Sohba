const mongoose = require('mongoose');
const validator = require('validator');
userRoles = require('../utils/userRoles');


const userSchema = new mongoose.Schema({
    firstName : {
        type : 'string',
        required : true
    },
    lastName : {
        type : 'string',
        required : true
    },
    email : {
        type : 'string',
        required : true,
        unique : true, // not repeate & every one has a special email
        validate :[validator.isEmail,'Please enter a valid email']
    },
    password : {
        type : 'string',
        required : true
    },
    token : {
        type : 'string'
    },
    role : {
        type : String ,
        enum : [userRoles.ADMIN,userRoles.USER,userRoles.MANGER], // مش هيسمح انك تدخله اي قيمة غير من دول
        default : userRoles.USER
    },
    avatar : {
        type : String ,
        default : '/uploads/profile.png'
    }
})

module.exports = mongoose.model('User', userSchema)
