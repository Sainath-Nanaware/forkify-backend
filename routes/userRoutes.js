const express=require("express")
const router=express.Router()

const {
  registration,
  login,
  update,
  addSavedRecipe,
  allSavedRecipes,
  removeSavedRecipe,
} = require("../controllers/userController");
const validate=require('../middlewares/schemaValidate')
const {registerSchema,loginSchema,updateUserSchema}=require('../validation/userValidation')
const auth = require("../middlewares/authMiddleware")


router.post('/register',validate(registerSchema),registration)
router.post('/login',validate(loginSchema),login)
router.put('/:id',auth,validate(updateUserSchema),update)
router.post('/savedRecipe',auth,addSavedRecipe)
router.get("/savedRecipes/:id", auth, allSavedRecipes);
router.delete("/saved-recipe/:userId/:recipeId", auth, removeSavedRecipe);
module.exports=router