const express = require("express")
const cors = require("cors")
const port = 5000


const server = express()

server.use(cors())     // middle ware


server.get("/getUser" , (req,res)=>{res.json({message : "no user Found ,, kel milte hai "})})





server.listen(port , ()=>{console.log(`Server started on port ${port} !`)})