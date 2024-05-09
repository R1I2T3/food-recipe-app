import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { v2 as cloudinary } from "cloudinary";
import AuthRouter from "./routes/auth";
import { poweredBy } from "hono/powered-by";
const app = new Hono();
import UserInfoRouter from "./routes/user/user-info";

// middlewares
app.use(logger());
app.use(cors({ origin: Bun.env.ORIGIN! }));
app.use(poweredBy());
app.use(prettyJSON());

// Cloudinary configuration
cloudinary.config({
  cloud_name: Bun.env.CLOUDINARY_CLOUD_NAME,
  api_key: Bun.env.CLOUDINARY_API_KEY,
  api_secret: Bun.env.CLOUDINARY_API_SECRET,
});

// All Api routes

app.route("/api/v1", AuthRouter);
app.route("/api/v1", UserInfoRouter);

export default app;
