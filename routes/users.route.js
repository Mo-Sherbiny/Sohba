const express = require('express');
const {body} = require('express-validator')
const router = express.Router();
const usersController = require('../controller/users.controller')
const verifyToken = require('../routes/midlleware/verifyToken')
const AppError = require('../utils/errorHandel');
const multer  = require('multer')

const diskStorage = multer.diskStorage({
        destination: function(req,file,cb){
        console.log('FILE',file)
        cb(null, 'uploads')
        },
        filename: function(req,file, cb){
        cb(null, Date.now() + '-' + file.originalname)
        }
})

const fileFilter = (req, file, cb) => {
    const imgType = file.mimetype.split('/')[0];
    if(imgType === 'image'){
        return cb(null, true)
    }
    else{
        return cb(AppError.create('file type must be image',400), false)
    }
} 

const upload = multer
                        ({
                        storage: diskStorage ,
                        fileFilter // because same name
                        })
 
// get all users
// register
// login

router.route('/')
                    .get(verifyToken,usersController.getAllUsers)
router.route('/register')
                    .post(upload.single('avatar'),usersController.register)
router.route('/login')
                    .post(usersController.login)

module.exports = router;
