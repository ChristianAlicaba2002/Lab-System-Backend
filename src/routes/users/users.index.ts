import register from '@/handlers/users/registerHandler'
import { createRouter } from '@/lib/create-app'
import * as routes from '@/routes/users/users.route'

export const users = createRouter()
  .openapi(routes.createUser, register)
