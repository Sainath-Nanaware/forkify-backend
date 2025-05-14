const express=require("express")
const router=express.Router()

const {registration}=require('../controllers/userController')
const validate=require('../middlewares/schemaValidate')
const {registerSchema}=require('../validation/userValidation')


router.post('/register',validate(registerSchema),registration)

module.exports=router