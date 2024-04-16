import { ApiSecurity, ApiTags } from '@nestjs/swagger'
import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  Query,
  UseGuards,
} from '@nestjs/common'
import * as kennitala from 'kennitala'

import { Documentation } from '@island.is/nest/swagger'
import { Audit } from '@island.is/nest/audit'
import { AdminPortalScope, UserProfileScope } from '@island.is/auth/scopes'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'

import { UserProfileDto } from './dto/user-profile.dto'
import { UserProfileService } from './user-profile.service'

const namespace = '@island.is/user-profile/v2/users'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Scopes(UserProfileScope.system, UserProfileScope.admin)
@ApiTags('v2/users')
@ApiSecurity('oauth2', [UserProfileScope.system])
@Controller({
  path: 'users',
  version: ['2'],
})
@Audit({ namespace })
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get('/')
  @Documentation({
    description: 'Get user profiles.',
    response: { status: 200, type: [UserProfileDto] },
  })
  @Audit<UserProfileDto>({
    resources: (profile) => profile.nationalId,
  })
  @Scopes(AdminPortalScope.serviceDesk)
  async findUserProfiles(@Query('search') search: string) {
    return this.userProfileService.findAllBySearchTerm(search)
  }

  @Get('/.national-id')
  @Documentation({
    description: 'Get user profile for given nationalId.',
    request: {
      header: {
        'X-Param-National-Id': {
          required: true,
          description: 'National id of the user to find',
        },
      },
    },
    response: { status: 200, type: UserProfileDto },
  })
  @Audit<UserProfileDto>({
    resources: (profile) => profile.nationalId,
  })
  @Scopes(
    UserProfileScope.system,
    UserProfileScope.admin,
    AdminPortalScope.serviceDesk,
  )
  async findUserProfile(
    @Headers('X-Param-National-Id') nationalId: string,
  ): Promise<UserProfileDto> {
    if (!kennitala.isValid(nationalId)) {
      throw new BadRequestException('National id is not valid')
    }
    return this.userProfileService.findById(nationalId)
  }
}
