import { OpenAPIHono } from "@hono/zod-openapi";
import { readHealthRoute } from "../route/health.route";

const app = new OpenAPIHono()
  .openapi(readHealthRoute, async (c) => {
    return c.json({
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
    });
  });

export default app;