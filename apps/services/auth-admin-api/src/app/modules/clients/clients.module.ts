import { Module } from '@nestjs/common'
import { ClientsController } from './clients.controller'
import {
  Client,
  ClientAllowedScope,
  ClientAllowedCorsOrigin,
  ClientPostLogoutRedirectUri,
  ClientRedirectUri,
  ClientIdpRestrictions,
  ClientSecret,
  ClientGrantType,
  ClientsService,
  ClientClaim,
} from '@island.is/auth-api-lib'
import { SequelizeModule } from '@nestjs/sequelize'
import { IdpRestrictionController } from './idp-restriction.controller'
import { CorsController } from './cors.controller'
import { RedirectUriController } from './redirect-uri.controller'
import { ClientGrantTypeController } from './client-grant-type.controller'
import { ClientAllowedScopeController } from './client-allowed-scope.controller'
import { ClientClaimController } from './client-claim.controller'

@Module({
  imports: [
    SequelizeModule.forFeature([
      Client,
      ClientAllowedScope,
      ClientAllowedCorsOrigin,
      ClientPostLogoutRedirectUri,
      ClientRedirectUri,
      ClientIdpRestrictions,
      ClientSecret,
      ClientPostLogoutRedirectUri,
      ClientGrantType,
      ClientClaim,
    ]),
  ],
  controllers: [
    ClientsController,
    IdpRestrictionController,
    CorsController,
    RedirectUriController,
    ClientGrantTypeController,
    ClientAllowedScopeController,
    ClientClaimController,
  ],
  providers: [ClientsService],
})
export class ClientsModule {}
