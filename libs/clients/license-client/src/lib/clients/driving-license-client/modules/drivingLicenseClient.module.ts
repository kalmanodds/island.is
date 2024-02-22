import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'
import { DrivingLicenseClient } from '../services/drivingLicenseClient.service'
import { Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { DrivingDigitalLicenseClientConfig } from '../drivingLicenseClient.config'
import {
  SmartSolutionsModule,
  SmartSolutionsModuleOptions,
} from '@island.is/clients/smart-solutions'

@Module({
  imports: [
    DrivingLicenseApiModule,

    SmartSolutionsModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof DrivingDigitalLicenseClientConfig>,
      ) => {
        const smartConfig: SmartSolutionsModuleOptions = {
          config: {
            apiKey: config.apiKey,
            apiUrl: config.apiUrl,
            passTemplateId: config.passTemplateId,
          },
        }
        return smartConfig
      },
      inject: [DrivingDigitalLicenseClientConfig.KEY],
    }),
  ],
  providers: [DrivingLicenseClient],
  exports: [DrivingLicenseClient],
})
export class DrivingClientModule {}
