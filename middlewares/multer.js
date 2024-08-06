const multer  = require('multer')


const upload = multer({ dest: 'uploads/'  })


const multmid = upload.single("image")


module.exports = multmid