import { recipesServices } from "../repository/recipesServices.js";
import { isValidObjectId } from "mongoose";
import CustomError from "../utils/CustomError.js";
import { TYPES_ERROR } from "../utils/EErrors.js";
import __dirname from "../utils/utils.js";
import path from "path";
import fs from "fs";

export class RecipesController {
  static getRecipes = async (req, res, next) => {
    try {
      let recipes = await recipesServices.getRecipes();

      return res.status(200).json(recipes);
    } catch (error) {
      req.logger.error(
        JSON.stringify(
          {
            name: error.name,
            message: error.message,
            stack: error.stack,
            code: error.code,
          },
          null,
          5
        )
      );
      return next(error);
    }
  };

  static getRecipeBy = async (req, res, next) => {
    try {
      const filter = {};
      const validCategories = ["title", "code", "portions", "tags"];

      for (const key in req.query) {
        if (validCategories.includes(key)) {
          if (key === "tags") {
            // Para búsqueda por arrays: tags
            filter[key] = { $in: req.query[key].split(",") }; // Divide los tags por comas
          } else {
            filter[key] = req.query[key];
          }
        }
      }

      let filterResult = await recipesServices.getRecipeBy(filter);

      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({ filterResult });
    } catch (error) {
      req.logger.error(
        JSON.stringify(
          {
            name: error.name,
            message: error.message,
            stack: error.stack,
            code: error.code,
          },
          null,
          5
        )
      );
      return next(error);
    }
  };

  static getRecipe = async (req, res, next) => {
    try {
      let id = req.params.id;
      if (!isValidObjectId(id)) {
        throw CustomError.createError(
          "Mongo Id no válido.",
          "El id proporcionado no cumple con el formato de Mongo Id.",
          "Elija un Mongo Id válido.",
          TYPES_ERROR.INVALID_ARGUMENTS
        );
      }

      let recipe = await recipesServices.getRecipebyId({ _id: id });

      if (recipe) {
        res.setHeader("Content-Type", "application/json");
        return res.status(200).json(recipe);
      } else {
        throw CustomError.createError(
          "No hay recetas con el Id elegido",
          "No hay recetas con el Id elegido",
          TYPES_ERROR.NOT_FOUND
        );
      }
    } catch (error) {
      req.logger.error(
        JSON.stringify(
          {
            name: error.name,
            message: error.message,
            stack: error.stack,
            code: error.code,
          },
          null,
          5
        )
      );
      return next(error);
    }
  };

  static addRecipe = async (req, res, next) => {
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
        notes,
      } = req.body;

      if (req.file) {
        image = `/uploads/${req.file.filename}`;
      }

      let exists;

      exists = await recipesServices.getRecipeBy({ code });

      if (exists) {
        if (req.file) {
          fs.unlinkSync(image);
        } else {
          throw CustomError.createError(
            "Código existente.",
            "El código de la receta ya existe.",
            `Ya hay una receta con el código ${code}.`,
            TYPES_ERROR.INVALID_ARGUMENTS
          );
        }
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
      if (notes) recipeData.notes = notes;

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
        } else {
          throw CustomError.createError(
            "Campos sin completar.",
            "Hay campos sin completar.",
            "Es necesario completar todos los campos para agregar una receta.",
            TYPES_ERROR.INVALID_ARGUMENTS
          );
        }
      }

      let newRecipe = await recipesServices.addRecipe(recipeData);

      res.setHeader("Content-Type", "application/json");
      return res.status(201).json({ message: "Recipe added.", newRecipe });
    } catch (error) {
      req.logger.error(
        JSON.stringify(
          {
            name: error.name,
            message: error.message,
            stack: error.stack,
            code: error.code,
          },
          null,
          5
        )
      );
      return next(error);
    }
  };

  static updateRecipe = async (req, res, next) => {
    try {
      let id = req.params.id;

      if (!isValidObjectId(id)) {
        throw CustomError.createError(
          "Mongo Id no válido.",
          "El id proporcionado no cumple con el formato de Mongo Id.",
          "Elija un Mongo Id válido.",
          TYPES_ERROR.INVALID_ARGUMENTS
        );
      }

      let updateProperties = req.body;

      if (req.file) {
        // Buscar receta existente para obtener el path de la imagen actual
        const existingRecipe = await recipesServices.getRecipebyId({ _id: id });

        if (existingRecipe && existingRecipe.image) {
          const oldImagePath = path.join(
            __dirname,
            "../public",
            existingRecipe.image
          );
          // Verificar si el archivo existe y eliminarlo
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        updateProperties.image = `/uploads/${req.file.filename}`;
      }

      if (updateProperties.code) {
        let exists;

        exists = await recipesServices.getRecipeBy({
          _id: { $ne: id },
          code: updateProperties.code,
        });
        if (exists) {
          throw CustomError.createError(
            "Código existente.",
            "El código de la receta ya existe.",
            `Ya hay una receta con el código ${updateProperties.code}.`,
            TYPES_ERROR.INVALID_ARGUMENTS
          );
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
        "notes",
      ];

      let properties = Object.keys(updateProperties);
      let valid = properties.every((prop) => validProperties.includes(prop));

      if (!valid) {
        throw CustomError.createError(
          "Propiedad no válida.",
          "Alguna de las propiedades no es válida.",
          `Alguna de las propiedades no es válida. Propiedades válidas son: ${validProperties}.`,
          TYPES_ERROR.INVALID_ARGUMENTS
        );
      }

      let updatedRecipe = await recipesServices.updateRecipe(
        id,
        updateProperties
      );

      if (!updatedRecipe) {
        throw CustomError.createError(
          "Receta no encontrada.",
          "Receta con el id elegido no fue encontrada.",
          `La receta con el id ${id} no fue encontrada.`,
          TYPES_ERROR.NOT_FOUND
        );
      }

      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({
        message: `La receta con el id ${id} fue actualizada.`,
        updatedRecipe,
      });
    } catch (error) {
      req.logger.error(
        JSON.stringify(
          {
            name: error.name,
            message: error.message,
            stack: error.stack,
            code: error.code,
          },
          null,
          5
        )
      );
      return next(error);
    }
  };

  static deleteRecipe = async (req, res, next) => {
    try {
      let id = req.params.id;

      if (!isValidObjectId(id)) {
        throw CustomError.createError(
          "Mongo Id no válido.",
          "El id proporcionado no cumple con el formato de Mongo Id.",
          "Elija un Mongo Id válido.",
          TYPES_ERROR.INVALID_ARGUMENTS
        );
      }

      let recipe = await recipesServices.getRecipebyId({ _id: id });

      if (!recipe) {
        throw CustomError.createError(
          "Receta no encontrada.",
          "Receta con el id elegido no fue encontrada.",
          `La receta con el id ${id} no fue encontrada.`,
          TYPES_ERROR.NOT_FOUND
        );
      }

      if (recipe.image) {
        const imagePath = path.join(__dirname, "../public", recipe.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      let deletedRecipe = await recipesServices.deleteRecipe(id);

      if (!deletedRecipe) {
        throw CustomError.createError(
          "Receta no encontrada o error.",
          "Receta con el id elegido no fue encontrada o hubo un error.",
          `La receta con el id ${id} no fue encontrada o ocurrió un error.`,
          TYPES_ERROR.NOT_FOUND
        );
      }

      return res
        .status(200)
        .json({ message: `La receta con el id ${id} fue eliminada.` });
    } catch (error) {
      req.logger.error(
        JSON.stringify(
          {
            name: error.name,
            message: error.message,
            stack: error.stack,
            code: error.code,
          },
          null,
          5
        )
      );
      return next(error);
    }
  };
}
