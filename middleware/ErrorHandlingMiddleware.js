const ApiError = require('../error/ApiError')
module.exports = function(req,res,next){
    if(error instanceof ApiError){
        return res.status(err.status).json({message:err.message})
    }
    return res.status(500).json({message:"Непредвиденная ошибка"})
}