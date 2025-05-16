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
  recipeById
} = require("../controllers/recipeController");

router.post("/",auth,roleCheck(["chef"]),validate(createRecipeSchema),createRecipe);
router.put("/:recipeId",auth,roleCheck(["chef"]),validate(updateRecipeSchema),updateRecipe);
router.delete("/:recipeId",auth,roleCheck(["chef"]),deleteRecipe);
router.get("/",auth,allRecipe)
router.get("/:recipeId",auth,recipeById)



module.exports=router
// api:{getall,getbyid,getbychefid,getbymealtype}
