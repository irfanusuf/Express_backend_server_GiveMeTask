const { messagehandler } = require("../utils/utils");

const cloudinary = require("cloudinary").v2;
const { config } = require("dotenv");
config("/.env");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadFile = async (req, res) => {
  try {
    const image = req.file.path;

    if (!image) {
      messagehandler(res, 400, "Image required!");
    }

    const upload = await cloudinary.uploader.upload(image);

    const url = upload.secure_url;

    if (upload) {
      res.json({ success: true, message: "Uploaded Succesfully!", url: url });
    } else {
      messagehandler(res, 203, "Cloudinary Error!");
    }
  } catch (error) {
    messagehandler(res, 500, "Internal Server Error!");
    console.log(error);
  }
};

module.exports = { uploadFile };
