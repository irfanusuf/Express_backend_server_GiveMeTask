const mongoose = require("mongoose");

const User = mongoose.model("User", {
  username: String,
  email: String,
  password: String,
  isAdmin : Boolean,
  isEmailVerified: Boolean,
  savedPosts : [],
  likedPosts : [],
  commentsGiven : [],
  post:[]
});

module.exports = User
