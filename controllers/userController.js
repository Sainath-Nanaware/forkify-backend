const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logger = require("../logs/logger");


const {
  successResponse,
  errorResponse,
  unauthorized,
} = require("../utils/responseHandler");

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
    successResponse(resp, {token,role:userExist.role}, "User login succesfully", 200);
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
