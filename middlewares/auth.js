const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
const { messagehandler } = require("../utils/utils");
config("/.env");


const isAuthenticated = (req, res, next) => {
  try {
    const  {token}  = req.cookies;
    const secretKey = process.env.SECRET_KEY;
    jwt.verify(token, secretKey, (error, decode) => {
      if (error) {
        messagehandler(res, 401, "unauthorised");
      } else {
        req.user = decode._id;
        return next();
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = isAuthenticated;
