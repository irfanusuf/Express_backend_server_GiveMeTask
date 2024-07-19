const express = require("express");
const cors = require("cors");
const connectDb = require("./utils/connectDb");
const { handleSignUp, handleLogin } = require("./controllers/userController");

const port = 5000;

// you are creating an instance of express

const server = express(); // inheritance

connectDb();

server.use(cors()); // middle ware
server.use(express.json())


// routes

server.get("/" , (req,res)=>{res.send("Hello server is working!")})

server.post("/user/signup" , handleSignUp )
server.post("/user/login" , handleLogin )

server.listen(port, () => {
  console.log(`Server started on port ${port} !`);
});
