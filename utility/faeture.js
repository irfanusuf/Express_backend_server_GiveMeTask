

function errorHandler (res , success, statusCode , message  ){

    return res.status(statusCode).json({success , message})


}


module.exports =  {errorHandler}