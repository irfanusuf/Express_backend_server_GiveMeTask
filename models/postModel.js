const mongoose = require("mongoose");
const User = require("./userModel");

const Post = mongoose.model("Post", {
  title: String,
  imageUrl: String,
  author: String,
  content: String,
  comments: [
    {
      comment: {
        type: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    },
  ],

  likes: [{
    user : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User"
    }
  } ],

 
  share: [],
});

module.exports = Post;
