const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Recipe=require("../models/recipeModel")
const mongoose=require("mongoose")
const {
  successResponse,
  errorResponse,
  unauthorized,
} = require("../utils/responseHandler");


exports.createRecipe=async(req,resp)=>{

    const recipeData=req.body
    try{
        const recipe=await Recipe.create(recipeData)
        successResponse(resp,recipe,"new recipe added",201)

    }catch(error){
        errorResponse(resp, "Internal server error", 500, error);
        console.log(error);
    }    
}

exports.updateRecipe=async(req,resp)=>{
    const recipeId = req.params.recipeId 
    if (!recipeId || !mongoose.Types.ObjectId.isValid(recipeId)) {
           return errorResponse(resp, "valid recipe Id is required", 400);
    }
    try{
        const recipeData=req.body
        const updatedRecipe=await Recipe.findByIdAndUpdate(
            recipeId,
            recipeData,
            { new: true}
        )
        if(!updatedRecipe){
           return errorResponse(resp, "recipe not found", 400);
        }
        successResponse(resp, updatedRecipe, "recipe updated ", 200);

    }catch(error){
        errorResponse(resp, "Internal server error", 500, error);
        console.log(error);
    }
}

exports.deleteRecipe=async(req,resp)=>{
    const recipeId = req.params.recipeId;
    if (!recipeId || !mongoose.Types.ObjectId.isValid(recipeId)) {
      return errorResponse(resp, "valid recipe Id is required", 400);
    }
    try {
      const deletedRecipe= await Recipe.findByIdAndDelete(recipeId)
      if(!deletedRecipe){
        return errorResponse(resp,"recipe not found",400)
      } 
      successResponse(resp,"Recipe deleted successfully", 200);
    } catch (error) {
      errorResponse(resp, "Internal server error", 500, error);
      console.log(error);
    }
}
