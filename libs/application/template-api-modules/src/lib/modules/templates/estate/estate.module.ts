import { DynamicModule } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'
import { SyslumennClientModule } from '@island.is/clients/syslumenn'

import { BaseTemplateAPIModuleConfig } from '../../../types'

import { EstateTemplateService } from './estate.service'
import { AwsModule } from '@island.is/nest/aws'

export class EstateTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: EstateTemplateModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        AwsModule,
        SyslumennClientModule,
      ],
      providers: [EstateTemplateService],
      exports: [EstateTemplateService],
    }
  }
}
