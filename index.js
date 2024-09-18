const express = require("express");
const http = require('http');
;
const cors = require("cors");
const cookie = require("cookie-parser")
const path =require("path")
const connectDb = require("./utils/connectDb");
const { handleSignUp, handleLogin , handleDelete ,handleEdit , handleGetUser, verifyEmail ,handleGetAllUsers}  = require("./controllers/userController");
const {handleCreatePost, getAllPosts, handleDeletePost, getPost, handleLike} = require("./controllers/postController");
const { uploadFile } = require("./controllers/uploadController");
const bodyParser = require("body-parser");
const verifyUser = require("./controllers/userVerification");
const isAuthenticated = require("./middlewares/auth");
const multmid = require("./middlewares/multer");

const { config } = require("dotenv");
const { Message } = require("./models/messageModel");
const { socketIo } = require("./utils/socket.io");
config("/.env")


const port = process.env.PORT;
 
// you are creating an instance of express

const app = express(); // inheritance
const server = http.createServer(app);

socketIo(server)

connectDb();

app.use(cors({
  origin: true,  
  credentials: true  
}));


// middle ware
// server.use(express.json())  // json parsing
app.use(bodyParser.json())
app.use(cookie())
app.use(express.static(path.join(__dirname, 'public')));


// setting hbs engine   ,, default is html

app.set("view engine" , "hbs")

// api route for verifying token
app.get("/token/verify" , verifyUser )

// api routes for user

app.get("/" , (req,res)=>{res.send("Hello server is working!")})
app.post("/user/signup" , handleSignUp )
app.post("/user/login" , handleLogin )
app.get("/verify/email/:_id" , verifyEmail )

//user authenticated Routes
app.delete("/user/delete",isAuthenticated, handleDelete )
app.put("/user/edit",isAuthenticated, handleEdit )
app.get("/user/getUser",isAuthenticated, handleGetUser )
app.get("/user/getAllUsers",isAuthenticated, handleGetAllUsers )

// api routes for post

app.post("/post/createPost",isAuthenticated, multmid, handleCreatePost )
app.post("/post/upload/image",isAuthenticated, multmid, uploadFile )
app.get("/post/getAll",isAuthenticated ,getAllPosts )
app.get("/post/get/:_id", isAuthenticated , getPost )
app.put("/post/pushLike/:_id", isAuthenticated , handleLike )
app.delete("/post/delete/:_id",isAuthenticated, handleDeletePost )

server.listen(port, () => {
  console.log(`Server started on port ${port} !`);
});
 