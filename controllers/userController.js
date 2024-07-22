const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { messagehandler } = require("../utils/utils");
const jwt = require("jsonwebtoken");

const handleSignUp = async (req, res) => {
  // const username =  req.body.username
  // const email =  req.body.email
  // const password =  req.body.password

  try {
    const { username, email, password } = req.body;

    if (username !== "" && email !== "" && password !== "") {
      const findUser = await User.findOne({ email });

      if (findUser) {
        res.json({ message: "User Already Registered" });
      } else {
        const hashpass = await bcrypt.hash(password, 10);
        const newUser = await User.create({
          username,
          email,
          password: hashpass,
        });
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
  try {
    const { email, password } = req.body;

    if (email === "" || password === "") {
      return messagehandler(res, 400, "All credentails Required!");
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return messagehandler(res, 400, "No user Found");
    }

    const checkpass = await bcrypt.compare(password, existingUser.password);

    if (!checkpass) {
      return messagehandler(res, 400, "Password Incorrect");
    }

    const payload = existingUser._id;

    const createToken = await jwt.sign({ _id: payload }, "thisismysecretkey");

    if (createToken) {
      res.json({ message: "user loggin success", token: createToken });
    }
  } catch (error) {
    console.log(error);
  }
};

const handleDelete = async (req, res) => {
  try {
    const _id = req.query._id;

    console.log(_id);

    const checkUser = await User.findById(_id);

    if (checkUser) {
      await User.findByIdAndDelete(_id);
      messagehandler(res, 200, "User deleted Succesfully");
    } else {
      messagehandler(res, 200, "User not found");
    }
  } catch (error) {
    console.log(error);
  }
};

const handleEdit = async (req, res) => {
  console.log("i m working  i m in login");
};

const handleGetUser = async (req, res) => {
  console.log("i m working  i m in login");
};

module.exports = {
  handleSignUp,
  handleLogin,
  handleDelete,
  handleEdit,
  handleGetUser,
};
