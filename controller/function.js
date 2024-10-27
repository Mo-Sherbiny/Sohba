const { validationResult } = require("express-validator")
let  Information  = require("../modules/course.modules")
const httpStatusText = require('../utils/httpStatustext')
const asyncWrapper = require('../routes/midlleware/asyncWrapper')
const AppError = require('../utils/errorHandel')

const getCourses = asyncWrapper(
    async (req,res) => {
    const query = req.query

    const limit = query.limit || 3; 
    const page  = query.page || 1;
    const skip  = (page - 1) * limit; // محفوظات يصاحبي

    const coursesall = await Information.find({},{"__v" : false}).limit(limit).skip(skip) 
    /*
    find({}) -> يعني هات كل حاجة لان الاوبجيكت فاضي و عادي متتحطش اوبجت برده
    find( {} , {"__v" : false} ) -> يعني هيشيلها و كذلك لو عايز تشيل اي حاجة تانية غيرها
    .limit(limit).skip(skip) --> الليميت اللي عايزه يتعرض في الصفحة و ممكن استلم الفاليو بتاعتهم من الريكويست او احطها بنفسي
    
    */
    res.json({status: httpStatusText.SUCCESS , data :{coursesall}})
})

const getsinglecourse = asyncWrapper(
    async (req , res , next) => {
    const course = await Information.findById(req.params.idCourse)
    if(!course){
        const err = AppError.create('Course not found',404,httpStatusText.FAIL)
        return next(err);
        // return res.status(404).json({status: httpStatusText.FAIL, data :{course:null}}) 
    }
        return res.json({status: httpStatusText.SUCCESS, data :{course}})
    // catch(err){
    //     return res.status(404).json({status: httpStatusText.ERROR, data :null , message : err.message , code:400})
    // }
    }
)
const createCourse = asyncWrapper(
    async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = AppError.create(errors.array(),400,httpStatusText.FAIL);
        return next(error);
    }

    const newCourse = new Information(req.body);

    await newCourse.save();

    res.status(201).json({status: httpStatusText.SUCCESS, data :{course : newCourse}})
})

const updatecourses = asyncWrapper(
    async (req,res) => {
    const id = req.params.idCourse;
        const course = await Information.findByIdAndUpdate(id,{$set: {...req.body}})
        return res.status(200).json({status: httpStatusText.SUCCESS, data :{course : course}})
    }
)

const deletecourses = asyncWrapper(
    async (req,res) => {
    await Information.deleteOne({_id:req.params.idCourse})
    res.status(200).json({status : httpStatusText.SUCCESS , data : null})
}
)
module.exports = {
    getCourses,
    getsinglecourse,
    createCourse,
    updatecourses,
    deletecourses
}


// https://github.com/omniti-labs/jsend