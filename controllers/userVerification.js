const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
const { messagehandler } = require("../utils/utils");
const User = require("../models/userModel");
config("/.env");

const verifyUser = async (req, res) => {
  try {
    const secretKey = process.env.SECRET_KEY;
    const { token } = req.cookies;

    jwt.verify(token, secretKey, async (error, decode) => {
      if (error) {
        messagehandler(res, 401 , "tokenNotVerfied");
      } else {
        const user = await User.findById(decode._id)
        if(user.isAdmin === true){
          res.json({ message: "adminVerified!"});
        }else{
          res.json({ message: "userverified!"});
        }
        
      } 
    });

  } catch (error) {
    console.log(error);
  }
};

module.exports = verifyUser;
