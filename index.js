const express = require("express");
const cors = require("cors");
const connectDb = require("./utils/connectDb");
const { handleSignUp, handleLogin , handleDelete ,handleEdit , handleGetUser} = require("./controllers/userController");
const bodyParser = require("body-parser");
const checkauth =require("./utils/auth")

const port = 4000;
 
// you are creating an instance of express

const server = express(); // inheritance

connectDb();

server.use(cors()); // middle ware
// server.use(express.json())  // json parsing
server.use(bodyParser.json())


// api routes

server.get("/" , (req,res)=>{res.send("Hello server is working!")})
server.post("/user/signup" , handleSignUp )
server.post("/user/login" , handleLogin )
server.delete("/user/delete/:_id" , handleDelete )
server.put("/user/edit/:_id" , handleEdit )
server.get("/user/userDetails/:token", checkauth,  handleGetUser )





server.listen(port, () => {
  console.log(`Server started on port ${port} !`);
});
