import { LicenseUpdateClientModule } from '@island.is/clients/license-client'
import { LicenseUpdateClientModule as LicenseUpdateClientModuleV2 } from '@island.is/clients/license-client-v2'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { LicenseModule as LicenseCommonModule } from '@island.is/services/license'
import { Module } from '@nestjs/common'
import {
  LicensesController,
  UserLicensesController,
} from './license.controller'
import { LicenseService } from './license.service'

@Module({
  imports: [
    LicenseUpdateClientModule,
    LicenseUpdateClientModuleV2,
    LicenseCommonModule,
  ],
  controllers: [LicensesController, UserLicensesController],
  providers: [
    {
      provide: LOGGER_PROVIDER,
      useValue: logger,
    },
    LicenseService,
  ],
})
export class LicenseModule {}
