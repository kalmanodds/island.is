import { AuthModule as BaseAuthModule } from '@island.is/auth-nest-tools'
import { AuditModule } from '@island.is/nest/audit'
import { ConfigModule, IdsClientConfig } from '@island.is/nest/config'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'
import { Module } from '@nestjs/common'
import { environment } from '../environment'
import { BffConfig } from './bff.config'
import { AuthModule as AppAuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    BaseAuthModule.register(environment.auth),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [FeatureFlagConfig, IdsClientConfig, BffConfig],
    }),
    UserModule,
    AppAuthModule,
  ],
})
export class AppModule {}
