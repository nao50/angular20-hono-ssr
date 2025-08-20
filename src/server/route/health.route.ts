import { createRoute } from "@hono/zod-openapi";
import { healthSchema } from "../schema/health.schema";

export const readHealthRoute = createRoute({
  method: "get",
  path: "/health",
  tags: ["health v1"],
  responses: {
    200: {
      description: "Client Information",
      content: {
        "application/json": {
          schema: healthSchema,
        },
      },
    }
  },
});
