const mongoose = require("mongoose");
const port =  "27017"
const { config } = require("dotenv");
config("/.env")


const url = process.env.MONGO_URI

const connectDb = async () => {
  try {
    await mongoose.connect(url);
    console.log(`Db Connected !`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
