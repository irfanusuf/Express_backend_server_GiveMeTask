const express = require("express");
const http = require('http');
const { Server } = require('socket.io');
const cors = require("cors");
const cookie = require("cookie-parser")
const path =require("path")
const connectDb = require("./utils/connectDb");
const { handleSignUp, handleLogin , handleDelete ,handleEdit , handleGetUser, verifyEmail ,handleGetAllUsers}  = require("./controllers/userController");
const {handleCreatePost, getAllPosts, handleDeletePost, getPost, handleLike, editPost} = require("./controllers/postController");
const { uploadFile } = require("./controllers/uploadController");
const bodyParser = require("body-parser");
const verifyUser = require("./controllers/userVerification");
const isAuthenticated = require("./middlewares/auth");
const multmid = require("./middlewares/multer");

const { config } = require("dotenv");
const { Message } = require("./models/messageModel");
config("/.env")


const port = process.env.PORT;
 
// you are creating an instance of express

const app = express(); // inheritance


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin:  "https://give-metask.vercel.app" ,// Allow React app's origin
    methods: ['GET', 'POST'],
  },
});

connectDb();

app.use(cors({
  origin: true,  
  credentials: true  
}));



const users = {}; // Store online users and their socket IDs

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle user registration and store socket ID
  socket.on('register', (userId) => {
    users[userId] = socket.id;
    console.log(`User ${userId} registered with socket ID: ${socket.id}`);
    io.emit('online_users', Object.keys(users)); // Send the updated list of online users to all clients
 
  });

  // Handle private messages
  socket.on('private_message', async ({ senderId, recipientId, message }) => {
    try {
      // Save the message to the database
      const newMessage = new Message({ sender: senderId, recipient: recipientId, message });
      await newMessage.save();

      // Send the message to the recipient if they are online
      const recipientSocketId = users[recipientId];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('private_message', {
          senderId,
          message,
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }

    io.emit('online_users', Object.keys(users)); // Send the updated list of online users to all clients
  });
});

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
app.put("/post/edit/:_id", isAuthenticated ,multmid , editPost )
app.put("/post/pushLike/:_id", isAuthenticated , handleLike )
app.delete("/post/delete/:_id",isAuthenticated, handleDeletePost )

server.listen(port, () => {
  console.log(`Server started on port ${port} !`);
});
 