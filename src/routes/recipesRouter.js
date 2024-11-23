import { Router } from "express";
import { RecipesController } from "../controllers/recipesController.js";

export const routerRecipes = Router();

routerRecipes.get("/", RecipesController.getRecipes);
routerRecipes.post("/", RecipesController.addRecipe);
