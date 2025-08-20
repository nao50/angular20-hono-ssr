import { z } from '@hono/zod-openapi';

export const healthSchema = z.object({
  status: z.string().describe('Status of the health check'),
  message: z.string().describe('Message from the health check'),
  timestamp: z.iso.datetime().describe('Timestamp of the health check'),
});