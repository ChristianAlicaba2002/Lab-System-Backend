import type { AppRouteHandler } from '@/lib/types/app-types'
import type { CreateUserRoute } from '@/routes/users/users.route'
import bcrypt from 'bcryptjs'
import { createDb } from '@/db'
import { users } from '@/db/schema'
import * as httpStatusCodes from '@/openapi/http-status-codes'

export const CreateUserHandler: AppRouteHandler<CreateUserRoute> = async (c) => {
  const { username, email, password, user_type } = c.req.valid('json')

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const db = createDb(c)
    const [createdUser] = await db
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
        user_type,
      })
      .returning()

    const { password: _, ...userWithoutPassword } = createdUser

    return c.json(
      {
        message: 'User created successfully',
        data: userWithoutPassword,
      },
      httpStatusCodes.CREATED,
    )
  }
  catch (err) {
    console.error('User creation error:', err)
    return c.json(
      {
        message: 'Internal Server Error',
        errors: (err as Error).message,
      },
      httpStatusCodes.INTERNAL_SERVER_ERROR,
    )
  }
}
