const messagehandler = (res, statuscode, message) => {
  return res.status(statuscode).json({ message: message });
};

module.exports = { messagehandler };
