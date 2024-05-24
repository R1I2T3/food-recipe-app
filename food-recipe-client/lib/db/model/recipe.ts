import { Model } from "@nozbe/watermelondb";
import { relation, text } from "@nozbe/watermelondb/decorators";
import User from "./user";

export default class Recipe extends Model {
  static table = "recipes";
  @text("recipe_db_id")
  RecipeId!: string;
  @text("name")
  name!: string;
  @text("instruction")
  instruction!: string;
  @text("type")
  type!: string;
  @text("cuisine")
  cuisine!: string;
  @text("youtube_video_link")
  youtube_video_link!: string;
  @text("food_image_url")
  food_image_url!: string;

  @relation("user", "creatorId")
  creator!: any;
}
