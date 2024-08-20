import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import type { User } from '@island.is/judicial-system/types'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser extends Pick<User, 'nationalId'>>(
    err: Error,
    user: TUser,
  ): TUser {
    if (err || !user) {
      throw new UnauthorizedException(err?.message || 'Unauthorized') //TODO: better error handling
    }
    return user
  }
}
