import { Model } from "@nozbe/watermelondb";
import { field, text, date } from "@nozbe/watermelondb/decorators";
export default class User extends Model {
  static table = "user";
  @text("user_db_id")
  UserId!: string;
  @text("username")
  username!: string;
  @text("full_name")
  fullName!: string;
  @text("avatar_url")
  avatar_url!: string;
  @text("gender")
  gender!: string;
  @text("account_created_at")
  createdAt!: string;
}
