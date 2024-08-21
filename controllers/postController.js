const { messagehandler } = require("../utils/utils");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const cloudinary = require("cloudinary").v2;
const { config } = require("dotenv");
config("/.env");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const handleCreatePost = async (req, res) => {
  try {
    const _id = req.user;
    const user = await User.findById(_id);
    if (!user) {
      return messagehandler(res, 404, "User Not Found!");
    }

    const author = user.username;
    const { title, content } = req.body; // body object is added to req param by multer
    const image = req.file.path; // file object is added to req param by multer

    if (title === "" || content === "" || !image) {
      return messagehandler(res, 203, "All Data feilds Required");
    }

    const upload = await cloudinary.uploader.upload(image);

    if (!upload) {
      return messagehandler(res, 200, "Cloudinary Error");
    }

    // console.log(upload);

    const imageUrl = upload.secure_url;

    const newPost = await Post.create({ title, imageUrl, author, content });
    if (newPost) {
      return messagehandler(res, 201, "Post created Succesfully!");
    }
  } catch (error) {
    console.log(error);
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    if (posts) {
      res.json({
        success: true,
        message: "Posts fetched succesfully!",
        posts: posts,
      });
    } else {
      messagehandler(res, 404, "Posts not Found!");
    }
  } catch (error) {
    console.log(error);
  }
};

const getPost = async (req, res) => {
  try {
    const { _id } = req.params;

    const post = await Post.findById(_id);
    if (post) {
      res.json({ message: "Post!", post: post });
    } else {
      messagehandler(res, 404, "Post not Found!");
    }
  } catch (error) {
    console.log(error);
  }
};

const handleDeletePost = async (req, res) => {
  try {
    const _id = req.params;
    const delPost = await Post.findByIdAndDelete(_id);
  } catch (error) {}
};

const handleLike = async (req, res) => {
  try {
    const userId = req.user;   // is authenticated handler req.user object next()
    const { _id } = req.params;
    const post = await Post.findById(_id);

    const likeArr = post.likes;

    const alreadyLiked = likeArr.includes(userId);

    if (!post) {
      return messagehandler(res, 404, "Post Not Found!");
    }

    if (alreadyLiked) {
      await Post.findByIdAndUpdate(_id, {
        $pull: {
          likes: userId,
        },
      });
      return messagehandler(res, 200, "Like Removed !");
    } else {
      await Post.findByIdAndUpdate(_id, {
        $push: { likes: userId },
      });

      return messagehandler(res, 201, "U Liked Succesfully!");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handleCreatePost,
  getAllPosts,
  handleDeletePost,
  getPost,
  handleLike,
};
