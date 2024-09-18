const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { messagehandler } = require("../utils/utils");
const transporter = require("../utils/nodemailer");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
config("/.env");

const handleSignUp = async (req, res) => {
  // const username =  req.body.username
  // const email =  req.body.email
  // const password =  req.body.password

  try {
    const { username, email, password } = req.body;

    if (username !== "" && email !== "" && password !== "") {
      const findUser = await User.findOne({ email });

      if (findUser) {
        res.json({ message: "User Already Exists!" });
      } else {
        const hashpass = await bcrypt.hash(password, 10);
        const newUser = await User.create({
          username,
          email,
          password: hashpass,
        });

        // const baseUrl = "http://localhost:4000"
        const baseUrl = "https://algoacademy.onrender.com"
        const link = `${baseUrl}/verify/email/${newUser._id}`;
        const data = `Your account has been registered with Us ... kindly click on the below link    ${link} to actiavte your account  and confirm you Email`;

       const mail =  await transporter.sendMail({
          from: "irfanusuf33@gmail.com",
          to: `${email}`,
          subject: `Welecome ${username}`,
          text: data,
        });

        // console.log(mail)

        if (newUser && mail) {
          res.json({ message: "User Saved Succesfully " , mailsent : true });
        } else {
          res.json({ message: "Some Error" });
        }
      }
    } else {
      res.json({ message: "All user credentials Required" });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: "Server Error | 500" });
  }
};

const handleLogin = async (req, res) => {
  try {
    const secretkey = process.env.SECRET_KEY;
    const { email, password } = req.body;
    if (email === "" || password === "") {
      return messagehandler(res, 202, "All credentails Required!");
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return messagehandler(res, 202, "No user Found");
    }
    const checkpass = await bcrypt.compare(password, existingUser.password);
    if (!checkpass) {
      return messagehandler(res, 202, "Password Incorrect");
    }
    const payload = existingUser._id;
    const token = await jwt.sign({ _id: payload }, secretkey);
    if (token) {
      res.cookie("token", token, {
        maxAge: 1000*60*60*24*30,
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      res.status(200).json({ message: "user loggin success" });
    }
  } catch (error) {
    messagehandler(res, 500, "Server Error");
    console.log(error);
  }
};

const handleDelete = async (req, res) => {
  try {
    const _id = req.user;
    if (_id) {
      const checkUser = await User.findById(_id);
      if (checkUser) {
        await User.findByIdAndDelete(_id);
        messagehandler(res, 201, "User deleted Succesfully");
      } else {
        messagehandler(res, 200, "User not found");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const handleEdit = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const _id = req.user;
    if (_id === "" || !_id) {
      messagehandler(res, 400, "No ID passed from params");
    }

    const findUser = await User.findById(_id);
    if (!findUser) {
      messagehandler(res, 200, "User not Found!");
    }
    const hashPass = await bcrypt.hash(password, 10);
    const editUser = await User.findByIdAndUpdate({
      email,
      username,
      password: hashPass,
    });

    if (editUser) {
      messagehandler(res, 201, "User details Updated Succesfully!");
    } else {
      messagehandler(res, 200, "Some Error!");
    }
  } catch (error) {
    console.log(error);
  }
};

const handleGetUser = async (req, res) => {
  try {
    const _id = req.user;
    // console.log(_id);
    if (_id) {
      const user = await User.findById(_id);
      const email = user.email;
      const id = user._id
      res.status(200).json({ message: "User data fetched Succesfully", email ,id });
    } else {
      res.json({ message: "No User Data Found!" });
    }
  } catch (error) {
    res.json({ message: "Server Error" });
    console.log(error);
  }
};

const handleGetAllUsers = async (req, res) => {
  try {
  
      const users = await User.find()
      res.status(200).json({ message: "All Users Fetched!", users });
   
  } catch (error) {
    res.json({ message: "Server Error" });
    console.log(error);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const _id = req.params;
    const user = await User.findById(_id);
    
    if (user) {
      await User.findByIdAndUpdate(_id, {
       
          isEmailVerified: true,
        
      });
      res.render("index" , {title : "ALGO ACADEMY | Verify"})
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handleSignUp,
  handleLogin,
  handleDelete,
  handleEdit,
  handleGetUser,
  handleGetAllUsers,
  verifyEmail,
};
