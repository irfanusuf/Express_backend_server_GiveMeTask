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
      return messagehandler(res, 400, "All Data feilds Required");
    }

    const upload = await cloudinary.uploader.upload(image);

    if (!upload) {
      return messagehandler(res, 200, "Cloudinary Error");
    }

    // console.log(upload);

    const imageUrl = upload.secure_url;

    const newPost = await Post.create({ title, imageUrl, author, content });
    if (newPost) {
      return messagehandler(res, 201, `Post ${newPost._id} created Succesfully!`);
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


const editPost = async(req,res) =>{
  try {

    const { _id } = req.params;
    const { title, content } = req.body; 
    const image = req.file.path; 

    if (title === "" || content === "" || !image) {
      return messagehandler(res, 400, "All Data feilds Required!");
    }

    const upload = await cloudinary.uploader.upload(image);

    if (!upload) {
      return messagehandler(res, 500, "Cloudinary Error");
    }

    // console.log(upload);

    const imageUrl = upload.secure_url;

    const updatePost = await Post.findByIdAndUpdate(_id , {
      title ,
      content,
      imageUrl
    },{ new: true } )

    if(updatePost) {
     return messagehandler(res,201,`Post ${_id} Updated SucessFully!`)
    }
  } catch (error) {
    console.log(error)
    return messagehandler(res,500 ,"Internal Server Error")
    
  }
}

const handleDeletePost = async (req, res) => {
  try {
    const {_id} = req.params;
    const delPost = await Post.findByIdAndDelete(_id);
    if(delPost){
      messagehandler(res,200 ,` Deleted Post ${_id}!`)
    }
  } catch (error) {
    console.log(error)
    return messagehandler(res,500 ,"Internal Server Error")
  }
};

const handleLike = async (req, res) => {
  try {
    const userId = req.user;   // is authenticated handler req.user object next()
    const { _id } = req.params;

    const post = await Post.findById(_id);

    if (!post) {
      return messagehandler(res, 404, "Post Not Found!");
    }

    const alreadyLiked = await post.likes.findIndex(
      (user) => user.user._id.toString() === userId
      );

      // await post.likes.push({ user: userId }); 
      // simple javascript array method

      // await User.findByIdAndUpdate(userId, { $push: { likedPosts: postId } });
      // method of mongoose


      if(alreadyLiked === -1){

        await post.likes.push({user : userId})
        await post.save()
        return messagehandler(res , 201 , "Liked!")

      }

      else if(alreadyLiked > -1){
        await post.likes.splice(alreadyLiked , 1)
        await post.save()
        return messagehandler(res , 200 , "Like Removed!")
      }
    



    // if (alreadyLiked === 1) {
    //   await Post.findByIdAndUpdate(_id, {
    //     $pull: {
    //       likes: userId,
    //     },
    //   });
    //   return messagehandler(res, 200, "Like Removed !");


     


    // } else {
    //   await Post.findByIdAndUpdate(_id, {
    //     $push: { likes: userId },
    //   });

    //   return messagehandler(res, 201, "U Liked Succesfully!");
    // }
  } catch (error) {
    
    console.log(error);
    messagehandler(res , 500 , "Internal Server Error")
  }
};

module.exports = {
  handleCreatePost,
  handleDeletePost,
  getAllPosts,
  getPost,
  editPost,
  handleLike,
};
