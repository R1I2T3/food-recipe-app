import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { prettyJSON } from "hono/pretty-json";
import { v2 as cloudinary } from "cloudinary";
const app = new Hono();

// middlewares
app.use(logger());
app.use(cors({ origin: Bun.env.ORIGIN! }));
app.use(csrf({ origin: Bun.env.ORIGIN! }));
app.use(prettyJSON());

// Cloudinary configuration
cloudinary.config({
  cloud_name: Bun.env.CLOUDINARY_CLOUD_NAME,
  api_key: Bun.env.CLOUDINARY_API_KEY,
  api_secret: Bun.env.CLOUDINARY_API_SECRET,
});

export default app;
