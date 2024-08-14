const express = require("express");
const cors = require("cors");
const connectDb = require("./utils/connectDb");
const { handleSignUp, handleLogin , handleDelete ,handleEdit , handleGetUser} = require("./controllers/userController");
const {handleCreatePost, getAllPosts, handleDeletePost, getPost} = require("./controllers/postController");
const { uploadFile } = require("./controllers/uploadController");
const bodyParser = require("body-parser");
const verifyUser = require("./controllers/userVerification");
const isAuthenticated = require("./middlewares/auth");
const multmid = require("./middlewares/multer");
const { config } = require("dotenv");

config("/.env")


const port = process.env.PORT;
 
// you are creating an instance of express

const server = express(); // inheritance

connectDb();

server.use(cors()); // middle ware
// server.use(express.json())  // json parsing
server.use(bodyParser.json())


// api route for verifying token
server.get("/token/verify/:token", verifyUser )


// api routes for user

server.get("/" , (req,res)=>{res.send("Hello server is working!")})
server.post("/user/signup" , handleSignUp )
server.post("/user/login" , handleLogin )

//user authenticated Routes
server.delete("/user/delete/:token" ,isAuthenticated, handleDelete )
server.put("/user/edit/:token" ,isAuthenticated, handleEdit )
server.get("/user/getUser/:token",isAuthenticated, handleGetUser )




// api routes for post


server.post("/post/createPost/:token",isAuthenticated, multmid, handleCreatePost )
server.post("/post/upload/image", multmid, uploadFile )
server.get("/post/getAll", getAllPosts )
server.get("/post/get/:_id", getPost )
server.delete("/post/delete/:token/:_id",isAuthenticated, handleDeletePost )






server.listen(port, () => {
  console.log(`Server started on port ${port} !`);
});
