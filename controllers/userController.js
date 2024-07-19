const User = require("../models/userModel");

const handleSignUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;


    console.log(req.body)
    const newUser = await new User({ username, email, password });

    const updateDb = await newUser.save();
    if (updateDb) {
      res.json({ message: "User Saved Succesfully!" });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Server Error : 500" });
  }
};

const handleLogin = async (req, res) => {
  console.log("i m working  i m in login");
};

module.exports = { handleSignUp, handleLogin };
