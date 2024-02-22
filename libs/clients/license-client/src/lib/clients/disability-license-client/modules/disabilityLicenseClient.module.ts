import { DisabilityLicenseClientModule } from '@island.is/clients/disability-license'
import { Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { DisabilityLicenseClient } from '../services/disabilityLicenseClient.service'
import { DisabilityDigitalLicenseClientConfig } from '../disabilityLicenseClient.config'
import {
  SmartSolutionsModule,
  SmartSolutionsModuleOptions,
} from '@island.is/clients/smart-solutions'

@Module({
  imports: [
    DisabilityLicenseClientModule,
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
  providers: [DisabilityLicenseClient],
  exports: [DisabilityLicenseClient],
})
export class DisabilityClientModule {}
