import { recipesServices } from "../repository/recipesServices.js";
import __dirname from "../utils/utils.js";
import path from "path";

export class VistasController {
  static getHome = async (req, res) => {
    try {
      res.setHeader("Content-Type", "text/html");
      res
        .status(200)
        .sendFile(path.join(__dirname, "../public/html/index.html"));
    } catch (error) {
      res.setHeader("Content-Type", "text/html");
      return res.status(500).json({ error: "Internal server error." });
    }
  };

  static getRecipes = async (req, res) => {
    try {
      res.setHeader("Content-Type", "text/html");
      res
        .status(200)
        .sendFile(path.join(__dirname, "../public/html/recipes.html"));
    } catch (error) {
      res.setHeader("Content-Type", "text/html");
      return res.status(500).json({ error: "Internal server error." });
    }
  };

  static getRecipe = async (req, res) => {
    try {
      const { id } = req.query; // Captura el ID desde los parámetros de ruta
      if (!id) {
        return res.status(400).send("Recipe ID is required.");
      }

      // Realiza acciones con el ID, como buscar datos en la base de datos.
      res.sendFile(path.join(__dirname, "../public/html/recipe.html"));
    } catch (error) {
      res.setHeader("Content-Type", "text/html");
      return res.status(500).json({ error: "Internal server error." });
    }
  };

  static getContact = async (req, res) => {
    try {
      res.setHeader("Content-Type", "text/html");
      res
        .status(200)
        .sendFile(path.join(__dirname, "../public/html/contact.html"));
    } catch (error) {
      res.setHeader("Content-Type", "text/html");
      return res.status(500).json({ error: "Internal server error." });
    }
  };
}
