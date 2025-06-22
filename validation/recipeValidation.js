const Joi = require("joi");
const mongoose = require("mongoose");

const createRecipeSchema = Joi.object({
  title: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  image: Joi.string().uri().required(), // Validates that it's a valid URL
  // ingredients: Joi.string().items(Joi.string().trim()).min(1).required(),
  // steps: Joi.string().items(Joi.string().trim()).min(1).required(),
  // mealType: Joi.string().items(Joi.string().trim()),
  // tags: Joi.string().items(Joi.string().trim()),
  createdBy: Joi.string()
    .custom((value, helpers) => {
      // Validate if it's a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message('"createdBy" must be a valid ObjectId');
      }
      return value;
    }),
});
const updateRecipeSchema = Joi.object({
  title: Joi.string().trim(),
  description: Joi.string().trim(),
  image: Joi.string().uri(),
  ingredients: Joi.array().items(Joi.string().trim()),
  steps: Joi.array().items(Joi.string().trim()),
  mealType: Joi.array().items(Joi.string().trim()),
  tags: Joi.array().items(Joi.string().trim()),
  createdBy: Joi.string()
    .custom((value, helpers) => {
      // Validate if it's a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message('"createdBy" must be a valid ObjectId');
      }
      return value;
    })
    .required(),
}).min(1);  

module.exports={createRecipeSchema,updateRecipeSchema}
