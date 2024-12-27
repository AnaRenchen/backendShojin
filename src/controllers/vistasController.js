import __dirname from "../utils/utils.js";
import path from "path";
import { TYPES_ERROR } from "../utils/EErrors.js";
import CustomError from "../utils/CustomError.js";

export class VistasController {
  static getHome = async (req, res, next) => {
    try {
      res.setHeader("Content-Type", "text/html");
      res
        .status(200)
        .sendFile(path.join(__dirname, "../public/html/index.html"));
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

  static getRecipes = async (req, res, next) => {
    try {
      res.setHeader("Content-Type", "text/html");
      res
        .status(200)
        .sendFile(path.join(__dirname, "../public/html/recipes.html"));
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
      const { id } = req.query; // Captura el ID desde los parámetros de ruta
      if (!id) {
        throw CustomError.createError(
          "El Id de la receta es necesario.",
          "Id de la receta no disponible",
          "Es necesario prover el Id de la receta",
          TYPES_ERROR.INVALID_ARGUMENTS
        );
      }

      // Realiza acciones con el ID, como buscar datos en la base de datos.
      res.sendFile(path.join(__dirname, "../public/html/recipe.html"));
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

  static getContact = async (req, res) => {
    try {
      res.setHeader("Content-Type", "text/html");
      res
        .status(200)
        .sendFile(path.join(__dirname, "../public/html/contact.html"));
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
