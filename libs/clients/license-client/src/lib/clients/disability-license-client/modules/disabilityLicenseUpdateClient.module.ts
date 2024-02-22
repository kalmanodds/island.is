import { Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { DisabilityLicenseUpdateClient } from '../services/disabilityLicenseUpdateClient.service'
import {
  SmartSolutionsModule,
  SmartSolutionsModuleOptions,
} from '@island.is/clients/smart-solutions'
import { DisabilityDigitalLicenseClientConfig } from '../disabilityLicenseClient.config'

@Module({
  imports: [
    SmartSolutionsModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof DisabilityDigitalLicenseClientConfig>,
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
      inject: [DisabilityDigitalLicenseClientConfig.KEY],
    }),
  ],
  providers: [DisabilityLicenseUpdateClient],
  exports: [DisabilityLicenseUpdateClient],
})
export class DisabilityUpdateClientModule {}
