import { Router } from "express";
import { VistasController } from "../controllers/vistasController.js";

export const routerVistas = Router();

routerVistas.get("/", VistasController.getHome);

routerVistas.get("/recipes", VistasController.getRecipes);

routerVistas.get("/recipes/recipe", VistasController.getRecipe);

routerVistas.get("/contact", VistasController.getContact);
