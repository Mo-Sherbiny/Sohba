const asyncWrapper = require('../routes/midlleware/asyncWrapper');
const httpStatusText = require('../utils/httpStatustext');
const User = require('../modules/user.model');
const AppError = require('../utils/errorHandel');
const bcrypt = require("bcryptjs");
const generateJwt = require('../utils/generateJwt');




const getAllUsers = asyncWrapper(
        async (req,res) => {
    /*
    console.log(req.headers) 
    لما ببعت التوكن ببعته في الهيدر
    بس بكتب اسمه 
    Authorization
    و في الفاليو بكتب
    Bearar
    وبعد كدا مسافة و التوكن
     */
    const query = req.query

    const limit = query.limit || 3; 
    const page  = query.page || 1;
    const skip  = (page - 1) * limit; // محفوظات يصاحبي

    const users = await User.find({},{"__v" : false , "password" : false}).limit(limit).skip(skip) 
    res.json({status: httpStatusText.SUCCESS , data :{users}})
})

const register = asyncWrapper(
    async(req,res,next) => {
        console.log(req.body)
        const {firstName , lastName , email , password , role} = req.body; // get data from request.body

        const oldUser = await User.findOne({email: email}); //  Check email already exists or not
        if(oldUser){
            const error = AppError.create('User already exists',400,httpStatusText.FAIL);
            return next(error);
        }
        
        const hashpass = await bcrypt.hash(password,5)// bcrypt.hash(password,salt) salt -> كلام بتكتبه بيتعمله كوكاتنيت مع الباسورد عشان يصعب عملية تخمينه
        // لو في باسوردين زي بعض هيبقي الهاش مختلف برده 

        
        const newUser = new User({ // Create new user object to send to database
            firstName,
            lastName,
            email,
            password: hashpass,
            role,
            avatar : req.file.filename
        })
        /*
        require('crypto').randomBytes(32).toString('hex'); طريقة كويسة عشان تعمل سكريت كي زي ده
        'dcbef74b83573b2ae430394676ee15bc4c25adb8fe430b4a4307295e4fe71e9e' 
        */
       // generate token
       const token = await generateJwt({email:newUser.email, id:newUser._id , role:newUser.role})
       newUser.token = token;

        await newUser.save()
        res.status(201).json({status: httpStatusText.SUCCESS, data :{user : newUser}})  
    }
)

const login = asyncWrapper(
    async(req,res,next) => {
        // get data from database (email, password)
        const {email, password} = req.body;
        const user = await User.findOne({email: email})
       const token = await generateJwt({email:user.email, id:user._id , role:user.role})
        // check this data is like datapase
        // 1- if email or password are not exist
        if(!email || !password){ 
            const error = AppError.create(httpStatusText.FAIL,400, "email and password are required");
            return next(error);
        }
        // 2- if user is not found = email is wrong
        if(!user){
            const error = AppError.create(httpStatusText.ERROR,400, "User not found");
            return next(error);
        }
        const comparePassword = await bcrypt.compare(password,user.password)
        // 3- if password is wrong
        if(!comparePassword){
            const error = AppError.create(httpStatusText.ERROR,400, "Invalid password");
            return next(error);
        }
        // 4- if email and password are right
        if(user&&comparePassword){
            return res.status(201).json({status: httpStatusText.SUCCESS, data:{token}})  
        }

    }
)

module.exports = {
    getAllUsers,
    register,
    login
}