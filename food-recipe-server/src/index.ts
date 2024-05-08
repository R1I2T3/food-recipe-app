import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { prettyJSON } from "hono/pretty-json";
const app = new Hono();

// middlewares
app.use(logger());
app.use(cors({ origin: Bun.env.ORIGIN! }));
app.use(csrf({ origin: Bun.env.ORIGIN! }));
app.use(prettyJSON());

export default app;
