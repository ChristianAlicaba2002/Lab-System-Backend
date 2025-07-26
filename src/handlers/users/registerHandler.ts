import type { AppRouteHandler } from '@/lib/types/app-types'
import type { CreateRoute } from '@/routes/users/users.route'
import bcrypt from 'bcryptjs'
import { createDb } from '@/db'
import { userInsertSchema, users } from '@/db/schema'
import * as httpStatusCodes from '@/openapi/http-status-codes'

const RegisterHandler: AppRouteHandler<CreateRoute> = async (c) => {
  const body = await c.req.valid('json')
  const parsed = userInsertSchema.safeParse(body)

  if (!parsed.success) {
    return c.json(
      {
        message: 'Validation failed',
        errors: parsed.error.format(),
      },
      httpStatusCodes.BAD_REQUEST,
    )
  }

  const insertData = parsed.data
  const { db } = createDb(c)

  try {
    const hashedPassword = await bcrypt.hash(insertData.password, 10)

    const createdUser = {
      email: insertData.email,
      password: hashedPassword,
      first_name: insertData.first_name,
      last_name: insertData.last_name,
      user_type: insertData.user_type,
    }

    const [userCreated] = await db.insert(users).values(createdUser).returning()

    return c.json(
      {
        message: 'User created successfully',
        data: userCreated,
      },
      httpStatusCodes.CREATED,
    )
  }
  catch (err) {
    console.error('User creation error:', err)
    return c.json(
      {
        message: 'Internal Server Error',
        errors: err,
      },
      httpStatusCodes.INTERNAL_SERVER_ERROR,
    )
  }
}

export default RegisterHandler
