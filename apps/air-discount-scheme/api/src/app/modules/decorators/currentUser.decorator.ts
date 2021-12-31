import { User } from '../user/models/user.model'
import { environment } from '../../../environments'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { AuthenticationError } from 'apollo-server-express'
import { GqlExecutionContext } from '@nestjs/graphql'
import { decode } from 'jsonwebtoken'

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): User => {
    const req = GqlExecutionContext.create(context).getContext().req
    const sessionToken = req.cookies
      ? req.cookies[environment.idsTokenCookieName]
      : null

    if (!sessionToken) {
      throw new AuthenticationError('Invalid user session')
    }

    const decodedToken = decode(sessionToken) as User
    return {
      name: decodedToken.name,
      nationalId: decodedToken.nationalId,
    }
  },
)
