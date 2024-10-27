
const {body} = require('express-validator')

const valdation = () => {
    return [
        body('name').notEmpty()
        .withMessage('name is required')
        .isLength({min:3})
        .withMessage('name must be at least 3 characters'),
        body('age').notEmpty()
        .withMessage('age is required'),
    ] 
}

module.exports = {valdation};