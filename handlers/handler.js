const path = require("path");
const User = require("../models/user");
const bcrypt =require ("bcrypt")

const getIndex = (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "index.html"));
  } catch (error) {
    console.log(error);
  }
};


const addUser = async (req, res) => {
  const { firstName, lastName, Address, pincode, email, password } = req.body;

  if (
    firstName === "" ||
    lastName === "" ||
    Address === "" ||
    pincode === "" ||
    email === "" ||
    password === ""
  ) {
    return res.json({ message: "All credentials required " });
  }

  let user = await User.findOne({ email });

  if (user) {
    return res.json({ message: "user already exists" });
  }

  const encryptPass = await bcrypt.hash(password , 10)

   user = await User.create({
    firstName,
    lastName,
    Address,
    pincode,
    email,
    password : encryptPass,
  });

  if (user) {
    return res.json({ message: "user created Succesfully", user });
  } else {
    return res.json({ message: "Some Error , Try again" });
  }
};



const getUser = (req, res) => {};

module.exports = { getIndex, getUser, addUser };
