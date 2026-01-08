import __dirname from "../utils/utils.js";
import path from "path";
import { TYPES_ERROR } from "../utils/EErrors.js";
import CustomError from "../utils/CustomError.js";
import { recipesServices } from "../repository/recipesServices.js";
import { postServices } from "../repository/postsServices.js";
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

      // Leer el archivo HTML base de manera asíncrona
      const htmlPath = path.join(__dirname, "../public/html/recipe.html");
      let htmlContent = await fs.promises.readFile(htmlPath, "utf-8");

      // Meta tags de Open Graph
      const ogTags = `
          <meta charset="UTF-8">
          <meta property="og:title" content="${recipe.title}" />
          <meta property="og:description" content="${recipe.description}" />
          <meta property="og:image" content="${recipe.image}" />
          <meta property="og:url" content="https://tusitio.com/receta/${recipe._id}" />
          <meta property="og:type" content="article" />
          `;

      // Reemplazar el marcador en el HTML con las Open Graph tags generadas
      const updatehtml = htmlContent.replace("<!--OG_TAGS-->", ogTags);

      // Configurar el tipo de contenido antes de enviar la respuesta
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.status(200).send(updatehtml);
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

  static getPosts = async (req, res, next) => {
    try {
      res.setHeader("Content-Type", "text/html");
      res
        .status(200)
        .sendFile(path.join(__dirname, "../public/html/blog.html"));
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

  static getPost = async (req, res, next) => {
    try {
      // 🔹 ID desde query params
      const { id } = req.query;

      if (!id) {
        throw CustomError.createError(
          "El Id del post es necesario",
          "Id del post no disponible",
          "Es necesario proveer el Id del post",
          TYPES_ERROR.INVALID_ARGUMENTS
        );
      }

      // 🔹 Buscar el post
      const post = await postServices.getPostById(id);

      if (!post) {
        return res.status(404).send("Entrada no encontrada");
      }

      // 🔹 Leer el HTML base (entrada.html)
      const htmlPath = path.join(__dirname, "../public/html/entrada.html");

      let htmlContent = await fs.promises.readFile(htmlPath, "utf-8");

      // 🔹 Open Graph dinámico
      const ogTags = `
        <meta charset="UTF-8">
        <meta property="og:title" content="${post.title}" />
        <meta property="og:description" content="${post.content.substring(
          0,
          150
        )}" />
        <meta property="og:image" content="${
          post.image || "https://i.postimg.cc/QMYBncgw/comida-templo.png"
        }" />
        <meta property="og:url" content="https://cocinashojinryori.onrender.com/blog/post?id=${
          post._id
        }" />
        <meta property="og:type" content="article" />
      `;

      // 🔹 Reemplazar placeholder
      const updatedHtml = htmlContent.replace("<!--OG_TAGS-->", ogTags);

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.status(200).send(updatedHtml);
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
