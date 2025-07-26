import { createRoute, z } from '@hono/zod-openapi'
import { userInsertSchema } from '@/db/schema'
import jsonContent from '@/middleware/utils/json-content'
import * as httpStatusCodes from '@/openapi/http-status-codes'

export const createUserRoute = createRoute({
  tags: ['users'],
  method: 'post',
  path: '/users',
  request: {
    body: {
      content: {
        'application/json': {
          schema: userInsertSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    [httpStatusCodes.CREATED]: jsonContent(
      z.object({
        message: z.string(),
        data: userInsertSchema.omit({ password: true }),
      }),
      'User successfully created',
    ),
    [httpStatusCodes.BAD_REQUEST]: jsonContent(
      z.object({
        message: z.string(),
        errors: z.any(),
      }),
      'Validation failed',
    ),
    [httpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        message: z.string(),
        errors: z.any(),
      }),
      'Internal Server Error',
    ),
  },
})

export type CreateUserRoute = typeof createUserRoute
