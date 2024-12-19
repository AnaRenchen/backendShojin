import mongoose from "mongoose";

const recipesCollection = "recipes";

const recipesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    portions: { type: String, required: true },
    ingredients: [
      {
        type: mongoose.Schema.Types.Mixed, // Acepta cadenas y objetos
      },
    ],
    image: { type: String, required: true },
    tags: [{ type: String }],
    instruction: [{ type: String, required: true }],
    code: { type: String, required: true, unique: true },
    category: { type: String },
    curiosidad: { type: String },
  },
  {
    timestamps: true,
  }
);

export const recipesModel = mongoose.model(recipesCollection, recipesSchema);
