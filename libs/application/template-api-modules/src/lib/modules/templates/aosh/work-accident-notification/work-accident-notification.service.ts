import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../../types'
import { WorkAccidentNotification } from '@island.is/application/templates/aosh/work-accident-notification'
import {
  DataDto,
  WorkAccidentClientService,
} from '@island.is/clients/work-accident-ver'
import {
  getDateAndTime,
  getValueList,
} from './work-accident-notification.utils'
import { getValueViaPath } from '@island.is/application/core'

@Injectable()
export class WorkAccidentNotificationTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly workAccidentClientService: WorkAccidentClientService,
  ) {
    super(ApplicationTypes.WORK_ACCIDENT_NOTIFICATION)
  }

  async getInputOptions({
    auth,
  }: TemplateApiModuleActionProps): Promise<DataDto> {
    const data = await this.workAccidentClientService.getOptionsData(auth)

    return data
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const answers = application.answers as unknown as WorkAccidentNotification

    console.log({
      accidentForCreationDto: {
        companySSN: answers.companyInformation.nationalId,
        sizeOfEnterprise: parseInt(
          answers.companyInformation.numberOfEmployees,
          10,
        ),
        nameOfBranchOrDepartment: answers.companyInformation.nameOfBranch,
        address: answers.companyInformation.address,
        postcode: answers.companyInformation.postnumber,
        workplaceHealthAndSafety:
          answers.companyLaborProtection.workhealthAndSafetyOccupation?.map(
            (code: string) => {
              return parseInt(code, 10)
            },
          ),
        buyersSSN: answers.projectPurchase.nationalId,
        dateAndTimeOfAccident: getDateAndTime(
          answers.accident.date,
          answers.accident.time.split(':')[0],
          answers.accident.time.split(':')[1],
        ),
        aoshCame: answers.accident.didAoshCome === 'yes',
        policeCame: answers.accident.didPoliceCome === 'yes',
        numberOfVictims: answers.employee.length,
        municipalityWhereAccidentOccured: answers.accident.municipality, // Vilja þau code eða name til baka?
        specificLocationOfAccident: answers.accident.exactLocation,
        detailedDescriptionOfAccident: answers.accident.wasDoing.concat(
          '\n',
          answers.accident.wentWrong,
          '\n',
          answers.accident.how,
        ),
        workingEnvironment: answers.accident.accidentLocation.value,
        victims: answers.employee.map((employee, index) => {
          return {
            victimsSSN: employee.nationalField.nationalId,
            employmentStatusOfVictim: employee.employmentStatus
              ? parseInt(employee.employmentStatus, 10)
              : 0,
            employmentAgencySSN: employee.tempEmploymentSSN ?? '',
            startedEmploymentForCompany: new Date(employee.startDate),
            lengthOfEmployment: employee.employmentTime
              ? parseInt(employee.employmentTime, 10)
              : 0,
            percentageOfFullWorkTime: employee.employmentRate
              ? parseInt(employee.employmentRate, 10)
              : 0,
            workhourArrangement: employee.workhourArrangement
              ? parseInt(employee.workhourArrangement, 10)
              : 0,
            startOfWorkingDay: getDateAndTime(
              employee.startOfWorkdayDate,
              employee.startTime.split(':')[0],
              employee.startTime.split(':')[1],
            ),
            workStation: employee.workstation
              ? parseInt(employee.workstation, 10)
              : 0,
            victimsOccupation: employee.victimsOccupation.value,
            absenceDueToAccident: answers.absence[index]
              ? parseInt(answers.absence[index], 10)
              : 0,
            specificPhysicalActivities: getValueList(
              application.answers,
              `circumstances[${index}].physicalActivities`,
            ),
            specificPhysicalActivityMostSevere: getValueViaPath(
              application.answers,
              `circumstances[${index}].physicalActivitiesMostSerious`,
              null,
            ) as string | null,
            workDeviations: getValueList(
              application.answers,
              `deviations[${index}].workDeviations`,
            ),
            workDeviationMostSevere: getValueViaPath(
              application.answers,
              `deviations[${index}].workDeviationsMostSerious`,
              null,
            ) as string | null,
            contactModeOfInjuries: getValueList(
              application.answers,
              `causeOfInjury[${index}].contactModeOfInjury`,
            ),
            contactModeOfInjuryMostSevere: getValueViaPath(
              application.answers,
              `causeOfInjury[${index}].contactModeOfInjuryMostSerious`,
              null,
            ) as string | null,
            partsOfBodyInjured: getValueList(
              application.answers,
              `injuredBodyParts[${index}].partOfBodyInjured`,
            ),
            partOfBodyInjuredMostSevere: getValueViaPath(
              application.answers,
              `injuredBodyParts[${index}].partOfBodyInjuredMostSerious`,
              null,
            ) as string | null,
            typesOfInjury: getValueList(
              application.answers,
              `typeOfInjury[${index}].typeOfInjury`,
            ),
            typeOfInjuryMostSevere: getValueViaPath(
              application.answers,
              `typeOfInjury[${index}].typeOfInjuryMostSerious`,
              null,
            ) as string | null,
          }
        }),
        userPhoneNumber: answers.companyInformation.phonenumber,
        userEmail: answers.companyInformation.email,
      },
    })
    await this.workAccidentClientService.createAccident(auth, {
      accidentForCreationDto: {
        companySSN: answers.companyInformation.nationalId,
        sizeOfEnterprise: parseInt(
          answers.companyInformation.numberOfEmployees,
          10,
        ),
        nameOfBranchOrDepartment: answers.companyInformation.nameOfBranch,
        address: answers.companyInformation.address,
        postcode: answers.companyInformation.postnumber,
        workplaceHealthAndSafety:
          answers.companyLaborProtection.workhealthAndSafetyOccupation?.map(
            (code: string) => {
              return parseInt(code, 10)
            },
          ),
        buyersSSN: answers.projectPurchase.nationalId,
        dateAndTimeOfAccident: getDateAndTime(
          answers.accident.date,
          answers.accident.time.split(':')[0],
          answers.accident.time.split(':')[1],
        ),
        aoshCame: answers.accident.didAoshCome === 'yes',
        policeCame: answers.accident.didPoliceCome === 'yes',
        numberOfVictims: answers.employee.length,
        municipalityWhereAccidentOccured: answers.accident.municipality, // Vilja þau code eða name til baka?
        specificLocationOfAccident: answers.accident.exactLocation,
        detailedDescriptionOfAccident: answers.accident.wasDoing.concat(
          '\n',
          answers.accident.wentWrong,
          '\n',
          answers.accident.how,
        ),
        workingEnvironment: answers.accident.accidentLocation.value,
        victims: answers.employee.map((employee, index) => {
          return {
            victimsSSN: employee.nationalField.nationalId,
            employmentStatusOfVictim: employee.employmentStatus
              ? parseInt(employee.employmentStatus, 10)
              : 0,
            employmentAgencySSN: employee.tempEmploymentSSN ?? '',
            startedEmploymentForCompany: new Date(employee.startDate),
            lengthOfEmployment: employee.employmentTime
              ? parseInt(employee.employmentTime, 10)
              : 0,
            percentageOfFullWorkTime: employee.employmentRate
              ? parseInt(employee.employmentRate, 10)
              : 0,
            workhourArrangement: employee.workhourArrangement
              ? parseInt(employee.workhourArrangement, 10)
              : 0,
            startOfWorkingDay: getDateAndTime(
              employee.startOfWorkdayDate,
              employee.startTime.split(':')[0],
              employee.startTime.split(':')[1],
            ),
            workStation: employee.workstation
              ? parseInt(employee.workstation, 10)
              : 0,
            victimsOccupation: employee.victimsOccupation.value,
            absenceDueToAccident: answers.absence[index]
              ? parseInt(answers.absence[index], 10)
              : 0,
            specificPhysicalActivities: getValueList(
              application.answers,
              `circumstances[${index}].physicalActivities`,
            ),
            specificPhysicalActivityMostSevere: getValueViaPath(
              application.answers,
              `circumstances[${index}].physicalActivitiesMostSerious`,
              null,
            ) as string | null,
            workDeviations: getValueList(
              application.answers,
              `deviations[${index}].workDeviations`,
            ),
            workDeviationMostSevere: getValueViaPath(
              application.answers,
              `deviations[${index}].workDeviationsMostSerious`,
              null,
            ) as string | null,
            contactModeOfInjuries: getValueList(
              application.answers,
              `causeOfInjury[${index}].contactModeOfInjury`,
            ),
            contactModeOfInjuryMostSevere: getValueViaPath(
              application.answers,
              `causeOfInjury[${index}].contactModeOfInjuryMostSerious`,
              null,
            ) as string | null,
            partsOfBodyInjured: getValueList(
              application.answers,
              `injuredBodyParts[${index}].partOfBodyInjured`,
            ),
            partOfBodyInjuredMostSevere: getValueViaPath(
              application.answers,
              `injuredBodyParts[${index}].partOfBodyInjuredMostSerious`,
              null,
            ) as string | null,
            typesOfInjury: getValueList(
              application.answers,
              `typeOfInjury[${index}].typeOfInjury`,
            ),
            typeOfInjuryMostSevere: getValueViaPath(
              application.answers,
              `typeOfInjury[${index}].typeOfInjuryMostSerious`,
              null,
            ) as string | null,
          }
        }),
        userPhoneNumber: answers.companyInformation.phonenumber,
        userEmail: answers.companyInformation.email,
      },
    })
  }
}
