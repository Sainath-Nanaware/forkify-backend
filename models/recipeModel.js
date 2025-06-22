const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      //   required: true,
      trim: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    steps: {
      type: [String],
      required: true,
    },
    mealType: {
      type: [String], // e.g., ["Breakfast", "Dinner"]
      default: [],
    },
    tags: {
      type: [String], // e.g., ["Vegetarian", "Asian"]
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Recipe = model("recipes", recipeSchema);

module.exports = Recipe;
