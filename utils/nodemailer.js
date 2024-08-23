const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: "irfanusuf33@gmail.com",
    pass: "ntal lwci fsvl jjjp",
  },
});



module.exports = transporter