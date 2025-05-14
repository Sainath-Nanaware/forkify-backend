const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  successResponse,
  errorResponse,
  unauthorized,
} = require("../utils/responseHandler");

exports.registration = async (req, resp) => {
  const { username, email, password, role, status } = req.body;
  try {
    // console.log("email:",email);

    const userExist = await User.findOne({ email });
    // console.log(userExist)
    if (userExist) {
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
    successResponse(resp, newUser, "User registred", 201);
  } catch (error) {
    errorResponse(resp, "Internal server error", 500, error);
    console.log(error);
  }
};

exports.login = async (req, resp) => {
  const { email, password } = req.body;
  console.log("check login credentials");

  try {
    const userExist = await User.findOne({ email });
    // console.log(userExist);
    if (!userExist) {
      return errorResponse(resp, "invalid credential", 401);
    }
    const validPassword = await bcrypt.compare(password, userExist.password);
    if (!validPassword) {
      return errorResponse(resp, "invalid credential", 401);
    }
    // console.log(validPassword);

    if (userExist.status != "approved") {
      return unauthorized(resp);
    }
    const token = jwt.sign(
      { userId: userExist._id, email: userExist.email, role: userExist.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    successResponse(resp, token, "User login succesfully", 200);
  } catch (error) {
    errorResponse(resp, "Internal server error", 500, error);
    console.log(error);
  }
};

exports.update = async (req, resp) => {
  const { id } = req.params;
  try {
    const updateData = { ...req.body };
    const user = await User.findById(id);
    if (!user){
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

    return successResponse(resp, updatedUser, "User updated successfully");
  } catch (err) {
    console.log(err);
    return errorResponse(resp, "Internal server error", 500, err);
  }
};
