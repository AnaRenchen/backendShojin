import { Router } from "express";
import { RecipesController } from "../controllers/recipesController.js";
import { upload } from "../utils/utils.js";

export const routerRecipes = Router();

routerRecipes.get("/", RecipesController.getRecipes);
routerRecipes.get("/:id", RecipesController.getRecipe);
routerRecipes.post("/", upload.single("image"), RecipesController.addRecipe);
routerRecipes.put(
  "/:id",
  upload.single("image"),
  RecipesController.updateRecipe
);
routerRecipes.delete("/:id", RecipesController.deleteRecipe);
