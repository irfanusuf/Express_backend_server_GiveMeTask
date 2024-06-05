const mongoose = require("mongoose");

const connectDb = async () => {
  try {

    const uri = "mongodb://localhost:27017/mytestDb"
    await mongoose.connect(uri);
    console.log("data base connected ");
  } catch (error) {
    console.log(error);
  }
};


module.exports = connectDb