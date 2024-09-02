const mongoose = require("mongoose");




const Message = mongoose.model('Message', {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    timestamp: { type: Date, default: Date.now },
  });
  



  module.exports = {Message}