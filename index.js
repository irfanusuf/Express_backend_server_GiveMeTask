const express = require("express");
const path = require("path");
const {getIndex , getUser , addUser, deleteUser, EditUser} = require("./handlers/handler");
const connectDb =  require ("./utility/connectDb")
const port = 4000;



const app = express();
connectDb()



//middlewares
app.use(express.static(path.join(__dirname, "public"))); // serving static files to browser
app.use(express.json());


app.get("/", getIndex);

// CRUD OPERATION ON USER OBJECT
app.post('/user/create' , addUser)
app.get('/user/:userId', getUser)
app.delete('/user/:userId', deleteUser)
app.put('/user/:userId', EditUser)






app.listen(port, () => {
  return console.log(`server Listenting on port ${port}`);
});
