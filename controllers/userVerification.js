const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
const { messagehandler } = require("../utils/utils");
config("/.env");

const verifyUser = (req, res) => {
  try {
    const secretKey = process.env.SECRET_KEY;
    const { token } = req.params;


    jwt.verify(token, secretKey, (error, decode) => {
      if (error) {
        messagehandler(res, 200 , "tokenNotVerfied");
      } else {
        res.json({ message: "verified", decode });
      }
    });

  } catch (error) {
    console.log(error);
  }
};

module.exports = verifyUser;
