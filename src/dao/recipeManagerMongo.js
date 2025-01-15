import { recipesModel } from "./models/recipeModel.js";

export class RecipeManagerMongo {
  async getRecipes() {
    let recipes = await recipesModel.find().lean();
    return recipes;
  }

  async getRecipeBy(filter) {
    return await recipesModel.find(filter).lean();
  }

  async addRecipe(recipe) {
    let newRecipe = await recipesModel.create(recipe);
    return newRecipe;
  }

  async getRecipebyId(id) {
    return await recipesModel.findOne({ _id: id }).lean();
  }

  async updateRecipe(id, recipe) {
    return await recipesModel.findByIdAndUpdate({ _id: id }, recipe, {
      runValidators: true,
      returnDocument: "after",
    });
  }

  async deleteRecipe(id) {
    return await recipesModel.deleteOne({ _id: id });
  }
}
