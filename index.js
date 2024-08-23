const express = require("express");
const cors = require("cors");
const cookie = require("cookie-parser")
const connectDb = require("./utils/connectDb");
const { handleSignUp, handleLogin , handleDelete ,handleEdit , handleGetUser, verifyEmail} = require("./controllers/userController");
const {handleCreatePost, getAllPosts, handleDeletePost, getPost, handleLike} = require("./controllers/postController");
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

server.use(cors({
  origin: process.env.ORIGIN ,  
  credentials: true  
}));

// middle ware
// server.use(express.json())  // json parsing
server.use(bodyParser.json())
server.use(cookie())


// api route for verifying token
server.get("/token/verify" , verifyUser )

// api routes for user

server.get("/" , (req,res)=>{res.send("Hello server is working!")})
server.post("/user/signup" , handleSignUp )
server.post("/user/login" , handleLogin )
server.post("/verify/email/:_id" , verifyEmail )

//user authenticated Routes
server.delete("/user/delete",isAuthenticated, handleDelete )
server.put("/user/edit",isAuthenticated, handleEdit )
server.get("/user/getUser",isAuthenticated, handleGetUser )

// api routes for post

server.post("/post/createPost",isAuthenticated, multmid, handleCreatePost )
server.post("/post/upload/image",isAuthenticated, multmid, uploadFile )
server.get("/post/getAll",isAuthenticated ,getAllPosts )
server.get("/post/get/:_id", isAuthenticated , getPost )
server.put("/post/pushLike/:_id", isAuthenticated , handleLike )
server.delete("/post/delete/:_id",isAuthenticated, handleDeletePost )

server.listen(port, () => {
  console.log(`Server started on port ${port} !`);
});
