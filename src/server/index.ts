// import { Hono } from 'hono';
import { OpenAPIHono } from "@hono/zod-openapi";
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { requestId } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';

import { isMainModule } from '@angular/ssr/node';
import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import { join } from 'node:path';

import health from './api/health.api'

export const app = new OpenAPIHono()
  .use(requestId())
  .use(secureHeaders())
  .route('/api/v1', health)

/**
 * My API endpoint
 */
app.get('/api/v1/health', async (c) => {
  return c.json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Serve static files from /browser
 */
app.use(
  '*',
  serveStatic({
    root: join(import.meta.dirname, '../browser'),
    onFound: (path, c) => {
      c.header('Cache-Control', `public, immutable, max-age=31536000`);
    },
    onNotFound: () => {
      // Optionally log or handle the case where a static file is not found
    },
  })
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('*', async (c, next) => {
  const angularApp = new AngularAppEngine();
  const response = await angularApp.handle(c.req.raw);
  if (response) {
    return response;
  }
  return next();
});

app.notFound((c) => {
  return c.text('404 - Not found', 404);
});

app.onError((error, c) => {
  console.error(`${error}`);
  return c.text('Internal Server Error', 500);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = Number(process.env['PORT'] || 4000);
  serve({
    fetch: app.fetch,
    port,
  }, (info) => {
    console.log(`Hono server listening on http://localhost:${info.port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createRequestHandler(app.fetch);

export default app
export type AppType = typeof app
