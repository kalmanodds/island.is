import { FirearmDigitalLicenseClientConfig } from '../firearmLicenseClient.config'
import { ConfigType } from '@nestjs/config'
import {
  SmartSolutionsModule,
  SmartSolutionsModuleOptions,
} from '@island.is/clients/smart-solutions'

export const SmartSolutionsFirearmModule = SmartSolutionsModule.registerAsync({
  useFactory: (
    config: ConfigType<typeof FirearmDigitalLicenseClientConfig>,
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
  inject: [FirearmDigitalLicenseClientConfig.KEY],
})
