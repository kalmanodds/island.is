import { Injectable } from '@nestjs/common'
import { logger } from '@island.is/logging'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { transformApplicationToHealthInsuranceDTO } from './health-insurance.utils'
import { HealthInsuranceAPI } from '@island.is/health-insurance'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../base-template-api.service'

@Injectable()
export class HealthInsuranceService extends BaseTemplateApiService {
  constructor(
    private healthInsuranceAPI: HealthInsuranceAPI,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.HEALTH_INSURANCE)
  }

  async sendApplyHealthInsuranceApplication({
    application,
  }: TemplateApiModuleActionProps) {
    try {
      logger.info(
        `Start send Health Insurance application for ${application.id}`,
      )
      const applyInputs = transformApplicationToHealthInsuranceDTO(application)
      logger.info(`Finished transform Application to Health Insurance DTO`)

      await this.healthInsuranceAPI.applyInsurance(
        570,
        applyInputs.attachmentNames,
        applyInputs.vistaskjal,
      )

      logger.info(`Finished send Health Insurance application`)
    } catch (error) {
      logger.error(`Send health insurance application failed`)
      throw new Error(`Send health insurance application failed`)
    }
  }
}
