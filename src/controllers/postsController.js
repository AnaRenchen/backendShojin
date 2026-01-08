import { postServices } from "../repository/postsServices.js";
import { isValidObjectId } from "mongoose";
import CustomError from "../utils/CustomError.js";
import { TYPES_ERROR } from "../utils/EErrors.js";
import __dirname from "../utils/utils.js";
import path from "path";
import fs from "fs";

export class PostsController {
  static getPosts = async (req, res, next) => {
    try {
      let posts = await postServices.getPosts();

      return res.status(200).json(posts);
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

  static getPostBy = async (req, res, next) => {
    try {
      const filter = {};
      const validCategories = ["title", "code", "author"];

      for (const key in req.query) {
        if (validCategories.includes(key)) {
          filter[key] = req.query[key];
        }
      }

      let filterResult = await postServices.getPostBy(filter);

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

  static getPost = async (req, res, next) => {
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

      let post = await postServices.getPostById({ _id: id });

      if (post) {
        res.setHeader("Content-Type", "application/json");
        return res.status(200).json(post);
      } else {
        throw CustomError.createError(
          "No hay posts con el Id elegido",
          "No hay posts con el Id elegido",
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

  static addPost = async (req, res, next) => {
    try {
      let { title, author, content, image, code } = req.body;

      if (req.file) {
        image = `/uploads/${req.file.filename}`;
      }

      let exists;

      exists = await postServices.getPostBy({ code });

      if (exists.length > 0) {
        if (req.file) {
          fs.unlinkSync(image);
        } else {
          throw CustomError.createError(
            "Código existente.",
            "El código del post ya existe.",
            `Ya hay un post con el código ${code}.`,
            TYPES_ERROR.INVALID_ARGUMENTS
          );
        }
      }

      let postData = {
        title,
        content,
        author,
        image,
        code,
      };

      if (!title || !content || !author || !image || !code) {
        if (req.file) {
          fs.unlinkSync(image);
        } else {
          throw CustomError.createError(
            "Campos sin completar.",
            "Hay campos sin completar.",
            "Es necesario completar todos los campos para agregar un post.",
            TYPES_ERROR.INVALID_ARGUMENTS
          );
        }
      }

      let newPost = await postServices.addPost(postData);

      res.setHeader("Content-Type", "application/json");
      return res.status(201).json({ message: "Post added.", newPost });
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

  static updatePost = async (req, res, next) => {
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
        // Buscar post existente para obtener el path de la imagen actual
        const existingPost = await postServices.getPostBy({ _id: id });

        if (existingPost && existingPost.image) {
          const oldImagePath = path.join(
            __dirname,
            "../public",
            existingPost.image
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

        exists = await postServices.getPostBy({
          _id: { $ne: id },
          code: updateProperties.code,
        });
        if (exists) {
          throw CustomError.createError(
            "Código existente.",
            "El código del post ya existe.",
            `Ya hay un post con el código ${updateProperties.code}.`,
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

      let validProperties = ["title", "content", "author", "image", "code"];

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

      let updatedPost = await postServices.updatePost(id, updateProperties);

      if (!updatedPost) {
        throw CustomError.createError(
          "Post no encontrada.",
          "Post con el id elegido no fue encontrado.",
          `El post con el id ${id} no fue encontrado.`,
          TYPES_ERROR.NOT_FOUND
        );
      }

      res.setHeader("Content-Type", "application/json");
      return res.status(200).json({
        message: `El post con el id ${id} fue actualizado.`,
        updatedPost,
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

  static deletePost = async (req, res, next) => {
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

      let post = await postServices.getPostById({ _id: id });

      if (!post) {
        throw CustomError.createError(
          "Post no encontrado.",
          "Post con el id elegido no fue encontrado.",
          `El post con el id ${id} no fue encontrado.`,
          TYPES_ERROR.NOT_FOUND
        );
      }

      if (post.image) {
        const imagePath = path.join(__dirname, "../public", post.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      let deletedPost = await postServices.deletePost(id);

      if (!deletedPost) {
        throw CustomError.createError(
          "Post no encontrado o error.",
          "El post con el id elegido no fue encontrado o hubo un error.",
          `El post con el id ${id} no fue encontrado o ocurrió un error.`,
          TYPES_ERROR.NOT_FOUND
        );
      }

      return res
        .status(200)
        .json({ message: `El post con el id ${id} fue eliminado.` });
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
