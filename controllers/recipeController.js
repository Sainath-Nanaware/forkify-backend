const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Recipe=require("../models/recipeModel")
const mongoose=require("mongoose")
const {ObjectId}=require("bson")
const logger=require("../logs/logger")
const {
  successResponse,
  errorResponse,
  unauthorized,
} = require("../utils/responseHandler");


exports.createRecipe=async(req,resp)=>{
    logger.info("control in create recipe")
    
    try{
      var {
        title,
        description,
        ingredients,
        steps,
        tags,
        mealType,
      } = req.body;
      // console.log("req.body",req.body)
      // console.log("FILE:", req.file);
      ingredients = JSON.parse(ingredients|| "[]");
      steps = JSON.parse(steps || "[]");
      tags = JSON.parse(tags || "[]");
      mealType = JSON.parse(mealType || "[]");
      //  const mealType = Array.isArray(rawMealType)
      //    ? rawMealType.flat(Infinity)
      //    : [];
      const recipeInfo = {
        title,
        description,
        ingredients,
        steps,
        tags,
        mealType,
        image: req.file?.path || null,
        createdBy: req.userId,
      };
      const recipe = await Recipe.create(recipeInfo);
      logger.info("new recipe added");
      successResponse(resp, recipe, "new recipe added", 201);
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


exports.allRecipe=async(req,resp)=>{
  logger.info("control in get all recipe")
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try{
    const skip=(page-1)*limit
    const totalRecipes=await Recipe.countDocuments();
    const allRecipes = await Recipe.find().skip(skip).limit(limit);
    const respData = {
      totalRecipes,
      totalPages: Math.ceil(totalRecipes / limit),
      currentPage: page,
      recipes:allRecipes,
    };
    logger.info("send all recipes")
    successResponse(resp, respData, "all recipes list", 200);
    
  }catch(error){
    logger.error("internal server error");
    console.log(error);
    errorResponse(resp, "Internal server error", 500, error);
  }
}

exports.recipeById=async(req,resp)=>{
    logger.info("control in get recipe by id");
    const recipeId = req.params.recipeId;
    if (!recipeId || !mongoose.Types.ObjectId.isValid(recipeId)) {
      logger.warn("recipe id invalid");
      return errorResponse(resp, "valid recipe Id is required", 400);
    } 
    try{
      const recipe=await Recipe.findById(recipeId)
      if(!recipe){
        logger.warn("recipe not found")
        return errorResponse(resp,"recipe not found",400)
      }
      logger.info("recipe found")
      successResponse(resp, recipe, "recipes info", 200);
      
    }catch(error){
      logger.error("internal server error");
      console.log(error);
      errorResponse(resp, "Internal server error", 500, error);
    }
}
//given api only for single mealtype
exports.recipeByMealType=async(req, resp)=>{
      logger.info("control in get recipe by meal type")
      const {mealType}=req.query
      const page =parseInt(req.query.page)||1
      const limit=parseInt(req.query.limit)||10
      if(!mealType){
        logger.warn("meal type not present in request");
        return errorResponse(resp, "valid meal type is required", 400);
      }
      try{
        const skip = (page - 1) * limit;
        const query={}
        if(mealType !=="all"){
          query.mealType={ $regex: new RegExp(mealType, "i") }
        }

         const [recipes, totalRecipes] = await Promise.all([
           Recipe.find(query).skip(skip).limit(limit),
           Recipe.countDocuments(query),
         ]);
         const respData = {
           totalRecipes,
           totalPages: Math.ceil(totalRecipes / limit),
           currentPage: page,
           recipes: recipes,
         };


        logger.info("meal recipes found");
        successResponse(resp, respData, `all ${mealType} recipes`, 200);

      }catch(error){
        logger.error("internal server error");
        console.log(error);
        errorResponse(resp, "Internal server error", 500, error);
      }
}

exports.randomRecipes=async(req,resp)=>{
  logger.info("control in get random recipes")
  const limit=parseInt(req.params.limit)||5
  // console.log(limit)
  try{
    const recipes = await Recipe.aggregate([
      { $sample: { size: limit } }, // pick 5 random documents
    ]);
    logger.info("random recipes found")
    successResponse(resp, recipes, `all recipes`, 200);

  }catch(error){
        logger.error("internal server error");
        console.log(error);
        errorResponse(resp, "Internal server error", 500, error);
  }

}


exports.recipesByChefId=async(req,resp)=>{
    logger.info("controls:get all recipes by chef id")
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    var {chefId}=req.query;
    // chefId=new ObjectId(chefId);
    // console.log(chefId)
    if (!chefId || !mongoose.Types.ObjectId.isValid(chefId)) {
      logger.warn("chef id invalid");
      return errorResponse(resp, "valid chef Id is required", 400);
    }   
    try{
       const skip = (page - 1) * limit;
       const query={createdBy:chefId}
       const [recipes, totalRecipes] = await Promise.all([
         Recipe.find({ createdBy: chefId }).skip(skip).limit(limit),
         Recipe.countDocuments(query),
       ]);
       const respData = {
         totalRecipes,
         totalPages: Math.ceil(totalRecipes / limit),
         currentPage: page,
         recipes: recipes,
       };
       logger.info("Info:Get all recipes of chef")
       successResponse(resp,respData,"All Recipes of chef:",200);

    } catch (error) {
      logger.error("internal server error");
      console.log(error);
      errorResponse(resp, "Internal server error", 500, error);
    }
}