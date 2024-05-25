import { Model } from "@nozbe/watermelondb";
import { field, relation, text } from "@nozbe/watermelondb/decorators";
import Recipe from "./recipe";

export default class Ingredients extends Model {
  static table = "ingredients";
  @text("ingredient_db_id")
  ingredientId!: string;

  @text("name")
  IngredientName!: string;

  @field("quantity")
  quantity!: string;

  @relation("recipes", "recipeId")
  recipe!: any;
}
