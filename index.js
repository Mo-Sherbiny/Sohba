const express = require('express')
const app = express()
require('dotenv').config() // dotenv from npm
const port = process.env.PORT
const cors = require('cors')
const httpStatusText = require('./utils/httpStatustext')


app.use(cors()) // عشان الفرونت اند يتفادي مشكلة cors policy
app.use(express.json()) /*
جواه 
body parser
------
و منغيره هيطلع 
undefined
لما تيجي تعمل كونسول لل 
req.body
عشان هو مش فاهم اي الداتا اللي مبعوتة دي
*/




// CRUD --> Create - Read - Update - Delete

// const url = "mongodb+srv://mohamedelsherbiny099:0504805990@cluster0.nlphwxl.mongodb.net/sohpa?retryWrites=true&w=majority&appName=Cluster0";/ كدا مفيش بجنية سيكيورتي

const mongoose = require('mongoose');

const url = process.env.MONGO_URL;

mongoose.connect(url).then(() => {
    console.log("connect mongodb server");
    }
)
//----------------
const coursesRouter = require('./routes/courses.route')
app.use('/api/courses' , coursesRouter)
//----------------
const usersRouter = require('./routes/users.route')
app.use('/api/users' , usersRouter) // http://localhost:4000/api/users/ in postman
//----------------
const path = require('path')
app.use('/uploads' , express.static(path.join(__dirname , 'uploads'))) // join عشان تشتغل على اي اوبريتنج سيستم
// ---------------
// global middleware to not fouond routes
app.all('*', (req,res,next) => { // default routes -> في حالة لو الروت مش موجود
    return res.json({status: httpStatusText.ERROR , message:"this resource is not available"})
})

// glopal midlleware to handel errors
app.use((err,req,res,next)=>{
    res.status(err.code || 500).json({status :err.statusText || httpStatusText.ERROR , message: err.message , code : err.statusCode , data : null})
})



app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})

