import __dirname from "../utils/utils.js";
import path from "path";
import { TYPES_ERROR } from "../utils/EErrors.js";
import CustomError from "../utils/CustomError.js";
import { recipesServices } from "../repository/recipesServices.js";
import fs from "fs";

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
      // Buscar la receta en la base de datos
      const recipe = await recipesServices.getRecipebyId(id);
      if (!recipe) {
        return res.status(404).send("Receta no encontrada");
      }

      // Leer el archivo HTML base
      const htmlPath = path.join(__dirname, "../public/html/recipe.html");
      let htmlContent = fs.readFileSync(htmlPath, "utf-8");

      // Inyectar las Open Graph tags en el `<head>`
      htmlContent = htmlContent.replace(
        "</head>",
        `
    <meta property="og:title" content="${recipe.title}" />
    <meta property="og:description" content="${recipe.description}" />
    <meta property="og:image" content="${recipe.image}" />
    <meta property="og:url" content="https://tusitio.com/receta/${recipe._id}" />
    <meta property="og:type" content="article" />
</head>`
      );

      // Enviar el HTML modificado
      res.send(htmlContent);
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
