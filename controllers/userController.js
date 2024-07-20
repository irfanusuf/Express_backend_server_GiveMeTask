const User = require("../models/userModel");
const bcrypt = require("bcrypt")

const handleSignUp = async (req, res) => {
  // const username =  req.body.username
  // const email =  req.body.email
  // const password =  req.body.password

  try {
    const { username, email, password } = req.body;
    console.log(req.body)
    if (username !== "" && email !== "" && password !== "") {
      const findUser = await User.findOne({ email });

      if (findUser) {
        res.json({ message: "User Already Registered" });
      } else {
        const hashpass = await  bcrypt.hash(password ,10)
        const newUser = await User.create({ username, email, password :hashpass });
        if (newUser) {
          res.json({ message: "User Saved Succesfully " });
        } else {
          res.json({ message: "Some Error" });
        }
      }
    } else {
      res.json({ message: "No credentials " });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Server Error | 500" });
  }
};

const handleLogin = async (req, res) => {
  console.log("i m working  i m in login");
};

module.exports = { handleSignUp, handleLogin };
