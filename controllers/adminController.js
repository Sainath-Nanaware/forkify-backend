const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose=require("mongoose")
const logger=require("../logs/logger")
const {
  successResponse,
  errorResponse,
  unauthorized,
} = require("../utils/responseHandler");


// remeber pagination required 
exports.allUsers=async(req,resp)=>{
    logger.info("control in get allusers")
    try{
        // const allUsers=await User.find({role:{$ne:'admin'}})
        //in record admin record also include
        const allUsers=await User.find()
        logger.info("all user found")
        successResponse(resp, allUsers, "all users list", 200);
        
    }catch(error){
      logger.error("internal server error")
      errorResponse(resp, "Internal server error", 500, error);
        console.log(error);
    }

}

exports.usersByRole=async(req,resp)=>{
  logger.info("control in get users by role")
  const role = req.query.role; // get role from query parameter

    try {
      if (!role) {
        logger.warn("role not define")
        return errorResponse(resp, "Role is required", 400);
      }

      const users = await User.find({ role });
      logger.info("users found sucesfully")
      successResponse(resp, users, `all ${role} list`, 200);

    } catch (error) {
      logger.error("internal server error");
        errorResponse(resp, "Internal server error", 500, error);
        console.log(error);
    }
}

exports.updateUserStatus=async(req,resp)=>{
    //if we use :id then param and if use? is known as query
    logger.info("control in update user status")
     const userId = req.params.userId;
     const { status } = req.body;
     try{
         if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
          logger.warn("user id is invalid")
          return errorResponse(resp, "valid user Id is required", 400);
         }
        const user = await User.findByIdAndUpdate(
          userId,
          { status },
          { new: true }
        );
        console.log(user);
        if (!user) {
           logger.warn("user not found")
           return errorResponse(resp, "user not found", 400);
        }
        logger.info("user status updated")
        successResponse(resp, user, `User status updated to ${status}`, 200);
     }catch(error){
      logger.error("internal server error");
        errorResponse(resp, "Internal server error", 500, error);
        console.log(error);
     }
}
