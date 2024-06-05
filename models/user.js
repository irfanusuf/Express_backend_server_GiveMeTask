const mongoose  = require("mongoose");



const User =  mongoose.model("User" , {

    firstName : String,
    lastName : String,
    Address : String,
    pincode : Number,
    email : String,
    password : String,


})


module.exports =  User