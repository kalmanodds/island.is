import { AdrAndMachineLicenseClientModule } from '@island.is/clients/adr-and-machine-license'
import { Module } from '@nestjs/common'
import { ConfigType } from '@island.is/nest/config'
import { MachineLicenseClient } from './machineLicenseClient.service'
import { MachineDigitalLicenseClientConfig } from './machineLicenseClient.config'
import {
  SmartSolutionsModule,
  SmartSolutionsModuleOptions,
} from '@island.is/clients/smart-solutions'

@Module({
  imports: [
    AdrAndMachineLicenseClientModule,

    SmartSolutionsModule.registerAsync({
      useFactory: (
        config: ConfigType<typeof MachineDigitalLicenseClientConfig>,
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
      inject: [MachineDigitalLicenseClientConfig.KEY],
    }),
  ],
  providers: [MachineLicenseClient],
  exports: [MachineLicenseClient],
})
export class MachineClientModule {}
