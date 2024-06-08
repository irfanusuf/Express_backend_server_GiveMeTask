const path = require("path");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { errorHandler } = require("../utility/faeture");

const getIndex = (req, res) => {
  try {
    res.sendFile(path.join(__dirname, "index.html"));
  } catch (error) {
    console.log(error);
  }
};

const addUser = async (req, res) => {
  try {
    const { firstName, lastName, Address, pincode, email, password } = req.body;

    if (
      firstName === "" ||
      lastName === "" ||
      Address === "" ||
      pincode === "" ||
      email === "" ||
      password === ""
    ) {
      return errorHandler(res, false, 400, "All Credentials Required!");
    }

    let user = await User.findOne({ email });

    if (user) {
      return errorHandler(res, false, 400, "User Already Exists");
    }

    const encryptPass = await bcrypt.hash(password, 10);

    user = await User.create({
      firstName,
      lastName,
      Address,
      pincode,
      email,
      password: encryptPass,
    });

    if (user) {
      return res
        .status(201)
        .json({ message: "user created Succesfully", user });
    } else {
      return errorHandler(res, false, 500, "some Error");
    }
  } catch (error) {
    console.log(error);
    errorHandler(res, false, 500, "server Error");
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    let user = await User.findById({ _id: userId });

    if (user) {
      res.status(200).json({ message: "User Found!", user });
    } else {
      errorHandler(res, false, 400, "No user Found!");
    }
  } catch (error) {
    console.log(error);
    errorHandler(res, false, 500, "server Error");
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    let user = await User.findByIdAndDelete({ _id: userId });

    if (user) {
      res.status(200).json({ message: "User Deleted Sucessfully!" });
    } else {
      errorHandler(res, false, 400, "No user Found!");
    }
  } catch (error) {
    console.log(error);
    errorHandler(res, false, 500, "server Error ");
  }
};

const EditUser = async (req, res) => {
  try {
    const { userId } = req.params;
    let user = await User.findById({ _id: userId });

    if (user) {
      const { firstName, lastName, Address, pincode, email, password } =
        req.body;

      const encryptPass = await bcrypt.hash(password, 10);

      const update = await User.findByIdAndUpdate(
        { _id: userId },
        {
          firstName,
          lastName,
          Address,
          pincode,
          email,
          password: encryptPass,
        }
      );

      if (update) {
        res.status(200).json({ message: "User Updated Sucessfully" });
      } else {
        errorHandler(res, false, 400, "Some Error , please Try again !");
      }
    } else {
      errorHandler(res, false, 400, "User Not Found!");
    }
  } catch (error) {
    console.log(error);
    errorHandler(res, false, 500, "Server Error!");
  }
};

module.exports = { getIndex, getUser, addUser, deleteUser, EditUser };
