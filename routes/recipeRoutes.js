const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const { roleCheck } = require("../middlewares/roleCheck");
const validate = require("../middlewares/schemaValidate");
const {
  createRecipeSchema,
  updateRecipeSchema,
} = require("../validation/recipeValidation");

const {
  createRecipe,
  updateRecipe,
  deleteRecipe,
  allRecipe,
  recipeById,
  recipeByMealType,
  randomRecipes,
} = require("../controllers/recipeController");

const {upload}=require('../utils/cloudinaryStrorage')
//if we want upload multiple files use upload.array()

router.post(
  "/",
  auth,
  roleCheck(["chef"]),
  validate(createRecipeSchema),
  upload.single("image"),
  createRecipe
);
router.put("/:recipeId",auth,roleCheck(["chef"]),validate(updateRecipeSchema),updateRecipe);
router.delete("/:recipeId",auth,roleCheck(["chef"]),deleteRecipe);
router.get("/",auth,allRecipe)
router.get("/:recipeId",auth,recipeById)
router.get("/demoRecipes/:limit",randomRecipes)
router.get("/mealRecipes/recipe",auth,recipeByMealType)



module.exports=router
// api:{getall,getbyid,getbychefid,getbymealtype}
