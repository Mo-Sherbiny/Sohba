const mongoose = require('mongoose');

sohpaSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true  
    },
    age : {
        type : Number,
        required : true
    }
})

module.exports = mongoose.model('informations', sohpaSchema) //( Information --> informations ) by default