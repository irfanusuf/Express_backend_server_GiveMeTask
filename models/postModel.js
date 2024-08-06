const mongoose = require("mongoose")



const Post = mongoose.model("Post" , {

title : String,
imageUrl : String,
author : String,
comments : [],
likes : [],
dislike : [],
share : []

})

module.exports = Post