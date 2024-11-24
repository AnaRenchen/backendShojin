import { recipesServices } from "../services/recipesServices.js";
import { isValidObjectId } from "mongoose";
import { config } from "../config/config.js";

export class RecipesController {
  static getRecipes = async (req, res) => {
    try {
      let recipes = await recipesServices.getRecipes();

      return res.status(200).json({ recipes });
    } catch (error) {
      console.error(error.message);
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json({ status: "error", error: "Internal server error." });
    }
  };

  static addRecipe = async (req, res) => {
    try {
      let {
        title,
        description,
        portions,
        ingredients,
        image,
        tags,
        instruction,
        code,
        category,
        curiosidad,
      } = req.body;

      let exists;
      try {
        exists = await recipesServices.getRecipeBy({ code });
      } catch (error) {
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({ error: "Internal server error." });
      }

      if (exists) {
        res.setHeader("Content-Type", "application/json");
        return res
          .status(400)
          .json({ error: `Receta con el código ${code} ya existe` });
      }

      let recipeData = {
        title,
        description,
        portions,
        ingredients,
        image,
        tags,
        instruction,
        code,
      };

      if (category) recipeData.category = category;
      if (curiosidad) recipeData.curiosidad = curiosidad;

      let newRecipe = await recipesServices.addRecipe(recipeData);

      res.setHeader("Content-Type", "application/json");
      return res.status(201).json({ message: "Recipe added.", newRecipe });
    } catch (error) {
      console.error(error.message);
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json({ status: "error", error: "Internal server error." });
    }
  };
}
