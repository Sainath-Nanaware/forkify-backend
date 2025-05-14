const express=require('express')
const router=express.Router()
const auth=require('../middlewares/authMiddleware')
const {roleCheck}=require('../middlewares/roleCheck')
const {
  allUsers,
  usersByRole,
  updateUserStatus,
} = require("../controllers/adminController");
const validate = require("../middlewares/schemaValidate");
const { updateUserStatusSchema } = require("../validation/userValidation"); 


router.get('/allUsers',auth,roleCheck(['admin']),allUsers)
// userByRole: http://localhost:5000/admin/user?role=user
router.get('/user',auth,roleCheck(['admin']),usersByRole)
//updateStatus:http://localhost:5000/admin/user/68243495ac68bb489ad9b5d9
router.patch('/user/:userId', auth,validate(updateUserStatusSchema),roleCheck(["admin"]), updateUserStatus);

module.exports=router
