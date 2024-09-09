const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
const { messagehandler } = require("../utils/utils");
config("/.env");

const verifyUser = (req, res) => {
  try {
    const secretKey = process.env.SECRET_KEY;
    const { token } = req.cookies;

    jwt.verify(token, secretKey, (error, decode) => {
      if (error) {
        messagehandler(res, 401 , "tokenNotVerfied");
      } else {
        res.json({ message: "verified"});
      } 
    });

  } catch (error) {
    console.log(error);
  }
};

module.exports = verifyUser;
