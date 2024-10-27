const express = require('express');
const {body} = require('express-validator')
const router = express.Router();

const funcs = require('../controller/function')
const {valdation} = require('./midlleware/valdation')
const verifyToken = require('../routes/midlleware/verifyToken')
const userRoles = require('../utils/userRoles');
const allowedTo = require('../routes/midlleware/allowedTo')


router.route('/')
                    .get(funcs.getCourses).
                    post(verifyToken,allowedTo(userRoles.MANGER),valdation(),funcs.createCourse)



router.route('/:idCourse')
                            .get(funcs.getsinglecourse)
                            .patch(funcs.updatecourses)
                            .delete(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANGER),funcs.deletecourses)

module.exports = router;