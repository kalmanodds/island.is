import { AdrAndMachineLicenseClientModule } from '@island.is/clients/adr-and-machine-license'
import {
  SmartSolutionsApiClientModule,
  SmartSolutionsConfig,
} from '@island.is/clients/smartsolutions'
import {
  SmartSolutionsModule,
  SmartSolutionsModuleOptions,
} from '@island.is/clients/smart-solutions'
import { Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { AdrLicenseClient } from './adrLicenseClient.service'
import { AdrDigitalLicenseClientConfig } from './adrLicenseClient.config'

@Module({
  imports: [
    AdrAndMachineLicenseClientModule,
    SmartSolutionsModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof AdrDigitalLicenseClientConfig>,
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
      inject: [AdrDigitalLicenseClientConfig.KEY],
    }),
  ],
  providers: [AdrLicenseClient],
  exports: [AdrLicenseClient],
})
export class AdrClientModule {}
