const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters",
    "string.max": "Username must not exceed 50 characters",
  }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid",
  }),

  password: Joi.string().min(8).max(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
  }),

  role: Joi.string().valid("user", "admin", "chef").optional().messages({
    "any.only": "Role must be user or admin",
  }),

  status: Joi.string()
    .valid("pending", "approved", "blocked")
    .optional()
    .messages({
      "any.only": "Status must be pending, approved or blocked",
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});
const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(50).optional(),
  password: Joi.string().min(8).max(8).optional(),

});


const updateUserStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "approved", "blocked")
    .required()
    .messages({
      "any.only": "Status must be pending, approved or blocked",
    }),
});

module.exports = { registerSchema, loginSchema,updateUserSchema,updateUserStatusSchema};


