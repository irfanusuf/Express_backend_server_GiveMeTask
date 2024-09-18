
const { Server } = require('socket.io');
const { Message } = require('../models/messageModel');
const users = {}; // Store online users and their socket IDs




const socketIo = (server ) =>{


    const io = new Server(server, {
        cors: {
          origin:  "http://localhost:3000",
          methods: ['GET', 'POST'],
        },
      });
    
    
    
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
}




module.exports = {socketIo}