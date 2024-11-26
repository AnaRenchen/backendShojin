import { recipesServices } from "../repository/recipesServices.js";
import { isValidObjectId } from "mongoose";
import { config } from "../config/config.js";
import fs from "fs";

export class RecipesController {
  static getRecipes = async (req, res) => {
    try {
      let recipes = await recipesServices.getRecipes();

      return res.status(200).json(recipes);
    } catch (error) {
      console.error(error.message);
      res.setHeader("Content-Type", "application/json");
      return res
        .status(500)
        .json({ status: "error", error: "Internal server error." });
    }
  };

  static getRecipe = async (req, res) => {
    try {
      let id = req.params.id;
      if (!isValidObjectId(id)) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: "Elija un mongo id válido." });
      }

      let recipe = await recipesServices.getRecipebyId({ _id: id });

      if (recipe) {
        res.setHeader("Content-Type", "application/json");
        return res.status(200).json(recipe);
      } else {
        res.setHeader("Content-Type", "application/json");
        return res
          .status(400)
          .json({ error: `No hay recetas con el id ${id}` });
      }
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({ error: "Internal server error." });
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

      if (req.file) {
        image = req.file.path;
      }

      let exists;
      try {
        exists = await recipesServices.getRecipeBy({ code });
      } catch (error) {
        res.setHeader("Content-Type", "application/json");
        return res.status(500).json({ error: "Internal server error." });
      }

      if (exists) {
        if (req.file) {
          fs.unlinkSync(image);
        }
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

      if (
        !title ||
        !description ||
        !portions ||
        !ingredients ||
        !image ||
        !tags ||
        !instruction ||
        !code
      ) {
        if (req.file) {
          fs.unlinkSync(image);
        }
        return res
          .status(400)
          .json({ error: `Es necesario completar todos los campos.` });
      }

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

  static updateRecipe = async (req, res) => {
    try {
      let id = req.params.id;

      if (!isValidObjectId(id)) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: "Elija un id mongo válido." });
      }

      let updateProperties = req.body;

      if (req.file) {
        // Buscar receta existente para obtener el path de la imagen actual
        const existingRecipe = await recipesServices.getRecipebyId({ _id: id });

        if (existingRecipe && existingRecipe.image) {
          const oldImagePath = existingRecipe.image;
          // Verificar si el archivo existe y eliminarlo
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        updateProperties.image = req.file.path;
      }

      if (updateProperties.code) {
        let exists;
        try {
          exists = await recipesServices.getRecipeBy({
            _id: { $ne: id },
            code: updateProperties.code,
          });
          if (exists) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({
              error: `El código ${updateProperties.code} ya existe.`,
            });
          }
        } catch (error) {
          res.setHeader("Content-Type", "application/json");
          return res.status(500).json({ error: "Internal server error." });
        }
      }

      if (!updateProperties) {
        res.setHeader("Content-Type", "application/json");
        return res
          .status(400)
          .json({ error: "Hay propiedades que no son válidas." });
      }

      let validProperties = [
        "title",
        "description",
        "category",
        "portions",
        "ingredients",
        "image",
        "tags",
        "curiosidad",
        "instruction",
        "code",
      ];

      let properties = Object.keys(updateProperties);
      let valid = properties.every((prop) => validProperties.includes(prop));

      if (!valid) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({
          error: `Alguna de las propiedades no es válida. Propiedades válidas son: ${validProperties}.`,
        });
      }

      let updatedRecipe = await recipesServices.updateRecipe(
        id,
        updateProperties
      );

      if (!updatedRecipe) {
        res.setHeader("Content-Type", "application/json");
        return res
          .status(404)
          .json({ error: `La receta con el ${id} no fue encontrada.` });
      }

      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({
        message: `La receta con el id ${id} fue actualizada.`,
        updatedRecipe,
      });
    } catch (error) {
      console.error(error.message);
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({ error: "Internal server error." });
    }
  };

  static deleteRecipe = async (req, res) => {
    try {
      let id = req.params.id;

      if (!isValidObjectId(id)) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: "Elija un mongo id válido." });
      }

      let recipe = await recipesServices.getRecipebyId({ _id: id });

      if (!recipe) {
        res.setHeader("Content-Type", "application/json");
        return res
          .status(400)
          .json({ error: `No hay recetas con el id ${id}.` });
      }

      if (recipe.image) {
        const imagePath = recipe.image;

        try {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        } catch (error) {
          console.error("Error al eliminar la imagen:", error.message);
        }
      }

      let deletedRecipe = recipesServices.deleteRecipe(id);

      if (!deletedRecipe) {
        return res.status(404).json({
          error: `La receta con el id ${id} no fue encontrada u ocurrió un error.`,
        });
      }

      return res
        .status(200)
        .json({ message: `La receta con el id ${id} fue eliminada.` });
    } catch (error) {
      console.error(error.message);
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({ error: "Internal server error." });
    }
  };
}
