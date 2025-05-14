const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose=require("mongoose")
const {
  successResponse,
  errorResponse,
  unauthorized,
} = require("../utils/responseHandler");


// remeber pagination required 
exports.allUsers=async(req,resp)=>{
    
    try{
        // const allUsers=await User.find({role:{$ne:'admin'}})
        //in record admin record also include
        const allUsers=await User.find()
        successResponse(resp, allUsers, "all users list", 200);
        
    }catch(error){
        errorResponse(resp, "Internal server error", 500, error);
        console.log(error);
    }

}

exports.usersByRole=async(req,resp)=>{
    const role = req.query.role; // get role from query parameter

    try {
      if (!role) {
        return errorResponse(resp, "Role is required", 400);
      }

      const users = await User.find({ role });
      successResponse(resp, users, `all ${role} list`, 200);

    } catch (error) {
        errorResponse(resp, "Internal server error", 500, error);
        console.log(error);
    }
}

exports.updateUserStatus=async(req,resp)=>{
    //if we use :id then param and if use? is known as query
     const userId = req.params.userId;
     const { status } = req.body;
     try{
         if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
           return errorResponse(resp, "valid user Id is required", 400);
         }
        const user = await User.findByIdAndUpdate(
          userId,
          { status },
          { new: true }
        );
        console.log(user);
        if (!user) {
           return errorResponse(resp, "user not found", 400);
        }
        successResponse(resp, user, `User status updated to ${status}`, 200);
     }catch(error){
        errorResponse(resp, "Internal server error", 500, error);
        console.log(error);
     }
}
