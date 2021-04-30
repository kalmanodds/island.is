import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserIdentitiesController } from './user-identities.controller'
import {
  UserIdentity,
  Claim,
  UserIdentitiesService,
  AccessService,
  AdminAccess,
  ApiScopeUserAccess,
  ApiScopeUser,
} from '@island.is/auth-api-lib'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Claim,
      UserIdentity,
      AdminAccess,
      ApiScopeUserAccess,
      ApiScopeUser,
    ]),
  ],
  controllers: [UserIdentitiesController],
  providers: [UserIdentitiesService, AccessService],
})
export class UsersModule {}
