const jwt =require("jsonwebtoken")


const checkauth = async (req,res, next) => {
  try {
    const {token} = req.params

    console.log(token)

    const verifyToken = await jwt.verify(token , "thisismysecretkey")
    console.log(verifyToken._id)

    const _id = verifyToken._id
    req.info = _id

    return next()
 
  } catch (error) {
    console.log(error);
  }
};



module.exports = checkauth
