import { RecipeManagerMongo as RecipesDao } from "../dao/recipeManagerMongo.js";

class RecipesServices {
  constructor(dao) {
    this.dao = dao;
  }

  getRecipes = async () => {
    return await this.dao.getRecipes();
  };

  getRecipeBy = async (filter) => {
    return await this.dao.getRecipeBy(filter);
  };

  getRecipebyId = async (id) => {
    return await this.dao.getRecipeId(id);
  };

  addRecipe = async (recipe) => {
    return await this.dao.addRecipe(recipe);
  };

  deleteRecipe = async (id) => {
    return await this.dao.deleteRecipe(id);
  };

  updateRecipe = async (id, recipe) => {
    return await this.dao.updateRecipe(id, recipe);
  };
}

export const recipesServices = new RecipesServices(new RecipesDao());
