const User=require('../models/userModel')
const bcrypt=require("bcryptjs")
const {successResponse,errorResponse}=require('../utils/responseHandler')

exports.registration=async(req,resp)=>{
    const {username,email,password,role,status}=req.body
    try{
        console.log("email:",email);
        
        const userExist= await User.findOne({email})
        // console.log(userExist)
        if(userExist){
            return errorResponse(resp,'user already exist!',400) 
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser =await User.create({
          username,
          email,
          password: hashedPassword,
          role,
          status,
        });
        if (role) newUser.role = role;
        if (status) newUser.status = status;
        successResponse(resp,newUser,'User registred',201)

    }catch(error){
        errorResponse(resp,'Internal server error',500,error)
        console.log(error);
        
    }
}