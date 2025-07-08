const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../logs/logger");


const {
  successResponse,
  errorResponse,
  unauthorized,
} = require("../utils/responseHandler");
const { default: mongoose } = require("mongoose");
const { ObjectId } = require("bson");

exports.registration = async (req, resp) => {
  logger.info("control in registration");
  const { username, email, password, role, status } = req.body;
  try {
    // console.log("email:",email);

    const userExist = await User.findOne({ email });
    // console.log(userExist)
    if (userExist) {
      logger.warn("user already exist")
      return errorResponse(resp, "user already exist!", 400);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      status,
    });
    if (role) newUser.role = role;
    if (status) newUser.status = status;
    logger.info("user create")
    successResponse(resp, newUser, "User registred", 201);
  } catch (error) {
    logger.error("internal server error!")
    errorResponse(resp, "Internal server error", 500, error);
    console.log(error);
  }
};

exports.login = async (req, resp) => {
 logger.info("control in login")
  const { email, password } = req.body;
  // console.log("check login credentials");

  try {
    const userExist = await User.findOne({ email });
    // console.log(userExist);
    if (!userExist) {
      logger.warn("user not found")
      return errorResponse(resp, "invalid credential", 401);
    }
    const validPassword = await bcrypt.compare(password, userExist.password);
    if (!validPassword) {
      return errorResponse(resp, "invalid credential", 401);
    }
    // console.log(validPassword);

    if (userExist.status != "approved") {
      logger.warn("user not approved")
      return unauthorized(resp);
    }
    const token = jwt.sign(
      { userId: userExist._id, email: userExist.email, role: userExist.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    logger.info("user login succesfully")
    successResponse(resp, {token,role:userExist.role,id:userExist._id}, "User login succesfully", 200);
  } catch (error) {
    logger.error("internal server error")
    errorResponse(resp, "Internal server error", 500, error);
    console.log(error);
  }
};

exports.update = async (req, resp) => {
  logger.info("control in update user")
  const { id } = req.params;
  try {
    const updateData = { ...req.body };
    const user = await User.findById(id);
    if (!user){
        logger.warn("user not found")
        return errorResponse(resp, "User not found", 404);
    }
    if (updateData.username) user.username = updateData.username;
    if (updateData.password) user.password = await bcrypt.hash(updateData.password, 10); // Hash new password before save

    // Using findByIdAndUpdate with $set (safe)
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: user },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return errorResponse(resp, "User not found", 404);
    logger.info("user data updated")
    return successResponse(resp, updatedUser, "User updated successfully");
  } catch (err) {
    console.log(err);
    logger.error("internal server error")
    return errorResponse(resp, "Internal server error", 500, err);
  }
};


exports.addSavedRecipe = async (req, resp) => {
  logger.info("control:add saved recipe");
  try {
    const { recipeId, userId } = req.body;
    const userID = new ObjectId(userId);
    const recipeID = new ObjectId(recipeId);
    console.log(
      `userID:${userID} typeof${typeof userID} and userID:${recipeID} typeof${typeof recipeID}`
    );
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      logger.warn("invalid recipe id ");
      errorResponse(resp, "recipe id is not valid", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      logger.warn("invalid userID ");
      errorResponse(resp, "user id is not valid", 400);
    }
    const user = await User.findById(userID);
    console.log(user);
    if (!user.savedRecipes.includes(recipeID)) {
      user.savedRecipes.push(recipeID);
      await user.save();
    }
    logger.info("recipe add in user savedRecipes");
    successResponse(resp,data={},"recipe saved", 200);
  } catch (error) {
    console.log(error);
    logger.error("internal server error");
    return errorResponse(resp, "Internal server error", 500, error);
  }
};

exports.allSavedRecipes=async(req,resp)=>{
    try{
      logger.info("control:get all saved recipe")
      const {id}=req.params
      if (!mongoose.Types.ObjectId.isValid(id)) {
        logger.warn("invalid userID ");
        errorResponse(resp, "user id is not valid", 400);
      }
      const user=await User.findById(id).populate("savedRecipes")
      if(user===null){
        logger.warn("user not found ");
        errorResponse(resp, "user is not found", 404);
      }
      // console.log(user)
      logger.info("recipe add in user savedRecipes");
      successResponse(resp,user.savedRecipes, "all saved recipes:", 200);

    }catch(error){
      console.log(error);
      logger.error("internal server error");
      return errorResponse(resp, "Internal server error", 500, error);
    }
}

exports.removeSavedRecipe=async(req,resp)=>{
     try {
       const { userId, recipeId } = req.params;

       // Validate IDs
       if (!mongoose.Types.ObjectId.isValid(userId)) {
         return errorResponse(resp, "Invalid user ID", 400);
       }

       if (!mongoose.Types.ObjectId.isValid(recipeId)) {
         return errorResponse(resp, "Invalid recipe ID", 400);
       }

       // Find the user
       const user = await User.findById(userId);
       if (!user) {
         return errorResponse(resp, "User not found", 404);
       }

       // Remove the recipe ID from the savedRecipes array
       const beforeCount = user.savedRecipes.length;
       user.savedRecipes = user.savedRecipes.filter(
         (id) => id.toString() !== recipeId
       );

       // If nothing was removed
       if (beforeCount === user.savedRecipes.length) {
         return errorResponse(resp, "Recipe not found in saved list", 404);
       }

       await user.save();
       return successResponse(resp, "Recipe removed from saved list", 200);
     } catch (error) {
       console.error(error);
       return errorResponse(resp, "Internal Server Error", 500, error);
     }
}