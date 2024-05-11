import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { v2 as cloudinary } from "cloudinary";
import AuthRouter from "./src/routes/auth";
import { poweredBy } from "hono/powered-by";
import UserRouter from "./src/routes/user/user";
import RecipeRouter from "./src/routes/recipe";
import FavouriteRouter from "./src/routes/Liked";
import IngredientRouter from "./src/routes/ingredient";
import { handle } from "hono/vercel";

export const config = {
  runtime: "edge",
};

const app = new Hono();

// middlewares
app.use(logger());
app.use(cors({ origin: process.env.ORIGIN! }));
app.use(poweredBy());
app.use(prettyJSON());

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// All Api routes

app.route("/api/v1", AuthRouter);
app.route("/api/v1", UserRouter);
app.route("/api/v1", RecipeRouter);
app.route("/api/v1", FavouriteRouter);
app.route("/api/v1", IngredientRouter);

export default handle(app);
