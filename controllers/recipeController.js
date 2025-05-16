const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Recipe=require("../models/recipeModel")
const mongoose=require("mongoose")
const logger=require("../logs/logger")
const {
  successResponse,
  errorResponse,
  unauthorized,
} = require("../utils/responseHandler");


exports.createRecipe=async(req,resp)=>{
    logger.info("control in create recipe")
    const recipeData=req.body
    try{
        const recipe=await Recipe.create(recipeData)
        logger.info("new recipe added")
        successResponse(resp,recipe,"new recipe added",201)

    }catch(error){
        logger.error("internal server error")
        console.log(error);
        errorResponse(resp, "Internal server error", 500, error);
    }    
}

exports.updateRecipe=async(req,resp)=>{
    logger.info("control in update recipe")
    const recipeId = req.params.recipeId 
    if (!recipeId || !mongoose.Types.ObjectId.isValid(recipeId)) {
            logger.warn("recipe id invalid")
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
           logger.warn("recipe not found")
           return errorResponse(resp, "recipe not found", 400);
        }
        logger.info("recipe updated sucesfully")
        successResponse(resp, updatedRecipe, "recipe updated ", 200);

    }catch(error){
        logger.error("interal server error")
        console.log(error);
        errorResponse(resp, "Internal server error", 500, error);
    }
}

exports.deleteRecipe=async(req,resp)=>{
    logger.info("control in delete recipe")
    const recipeId = req.params.recipeId;
    if (!recipeId || !mongoose.Types.ObjectId.isValid(recipeId)) {
      logger.warn("recipe id is invalid")
      return errorResponse(resp, "valid recipe Id is required", 400);
    }
    try {
      const deletedRecipe= await Recipe.findByIdAndDelete(recipeId)
      if(!deletedRecipe){
        logger.warn("recipe not found")
        return errorResponse(resp,"recipe not found",400)
      } 
      logger.info("recipe delete sucesfully")
      successResponse(resp,"Recipe deleted successfully", 200);
    } catch (error) {
      logger.error("internal server error")
      console.log(error);
      errorResponse(resp, "Internal server error", 500, error);
    }
}
