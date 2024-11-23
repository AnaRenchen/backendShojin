import mongoose from "mongoose";

const recipesCollection = "recipes";
const recipesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    portions: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    image: { type: String, required: true },
    tags: [{ type: String }],
    instruction: [{ type: String, required: true }],
    category: { type: String },
    curiosidad: { type: String },
  },
  {
    timestamps: true,
  }
);

export const recipesModel = mongoose.model(recipesCollection, recipesSchema);
