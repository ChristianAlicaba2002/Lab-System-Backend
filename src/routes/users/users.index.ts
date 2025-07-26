import { CreateUserHandler } from '@/handlers/users/create-user-handler'
import { createRouter } from '@/lib/create-app'
import * as routes from '@/routes/users/users.route'

export const users = createRouter()
  .openapi(routes.createUserRoute, CreateUserHandler)
