import { recipesServices } from "../services/recipesServices.js";
import { isValidObjectId } from "mongoose";
import { config } from "../config/config.js";

export class RecipesController {
  static getRecipes = async (req, res) => {
    try {
      let recipes = await recipesServices.getRecipes();

      return res.status(200).json({ recipes });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json({ status: "error", error: "Internal server error." });
    }
  };

  static addRecipe = async (req, res) => {
    try {
      console.log("POST request received:", req.body);
      let {
        title,
        description,
        portions,
        ingredients,
        image,
        tags,
        instruction,
        category,
        curiosidad,
      } = req.body;

      let recipeData = {
        title,
        description,
        portions,
        ingredients,
        image,
        tags,
        instruction,
      };

      if (category) recipeData.category = category;
      if (curiosidad) recipeData.curiosidad = curiosidad;

      let newRecipe = await recipesServices.addRecipe(recipeData);

      console.log(newRecipe);

      res.setHeader("Content-Type", "application/json");
      return res.status(201).json({ message: "Recipe added.", newRecipe });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json({ status: "error", error: "Internal server error." });
    }
  };
}
