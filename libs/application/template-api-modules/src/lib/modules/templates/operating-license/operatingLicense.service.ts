import { Inject, Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'

import AmazonS3URI from 'amazon-s3-uri'
import {
  SyslumennService,
  Person,
  Attachment,
  PersonType,
  DataUploadResponse,
} from '@island.is/clients/syslumenn'
import {
  File,
  ApplicationAttachments,
  AttachmentPaths,
  CriminalRecord,
  DebtLessCertificateResult,
} from './types/attachments'
import {
  ApplicationTypes,
  ApplicationWithAttachments,
  YES,
} from '@island.is/application/types'
import { Info, BankruptcyHistoryResult } from './types/application'
import { getExtraData } from './utils'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { CriminalRecordService } from '@island.is/api/domains/criminal-record'
import { TemplateApiError } from '@island.is/nest/problem'
import { FinanceClientService } from '@island.is/clients/finance'
import { OperatingLicenseFakeData } from '@island.is/application/templates/operating-license/types'
import { JudicialAdministrationService } from '@island.is/clients/judicial-administration'
import { BANNED_BANKRUPTCY_STATUSES } from './constants'
import { error } from '@island.is/application/templates/operating-license'
import { isPerson } from 'kennitala'
import { User } from '@island.is/auth-nest-tools'
import { AwsService } from '@island.is/nest/aws'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'

@Injectable()
export class OperatingLicenseService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly syslumennService: SyslumennService,
    private readonly criminalRecordService: CriminalRecordService,
    private readonly financeService: FinanceClientService,
    private readonly judicialAdministrationService: JudicialAdministrationService,
    private readonly awsService: AwsService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {
    super(ApplicationTypes.OPERATING_LICENSE)
  }

  async criminalRecord({
    application,
  }: TemplateApiModuleActionProps): Promise<{ success: boolean }> {
    const fakeData = getValueViaPath<OperatingLicenseFakeData>(
      application.answers,
      'fakeData',
    )
    const useFakeData = fakeData?.useFakeData === YES

    if (useFakeData) {
      return fakeData?.criminalRecord === YES
        ? Promise.resolve({ success: true })
        : Promise.reject({
            reason: {
              title: error.dataCollectionCriminalRecordTitle,
              summary: error.dataCollectionCriminalRecordErrorTitle,
              hideSubmitError: true,
            },
            statusCode: 404,
          })
    }
    try {
      const applicantSsn =
        application.applicantActors.length > 0
          ? application.applicantActors[0]
          : application.applicant
      const hasCriminalRecord =
        await this.criminalRecordService.validateCriminalRecord(applicantSsn)
      if (hasCriminalRecord) {
        return { success: true }
      }

      throw new TemplateApiError(
        {
          title: error.dataCollectionCriminalRecordTitle,
          summary: coreErrorMessages.errorDataProvider,
        },
        400,
      )
    } catch (e) {
      throw new TemplateApiError(
        {
          title: error.dataCollectionCriminalRecordTitle,
          summary: coreErrorMessages.errorDataProvider,
        },
        400,
      )
    }
  }

  async getDebtLessCertificate(auth: User): Promise<DebtLessCertificateResult> {
    const response = await this.financeService.getDebtLessCertificate(
      auth.nationalId,
      'IS',
      auth,
    )
    if (!response?.debtLessCertificateResult) {
      throw new TemplateApiError(
        {
          title: error.missingCertificateTitle,
          summary: error.missingCertificateSummary,
        },
        400,
      )
    }

    if (response?.error) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.errorDataProvider,
          summary: response.error.message,
        },
        response.error.code,
      )
    }

    return response.debtLessCertificateResult
  }

  async debtLessCertificate({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<{ success: boolean }> {
    const fakeData = getValueViaPath<OperatingLicenseFakeData>(
      application.answers,
      'fakeData',
    )
    const useFakeData = fakeData?.useFakeData === YES

    if (useFakeData) {
      return fakeData?.debtStatus === YES
        ? Promise.resolve({ success: true })
        : Promise.reject({
            reason: {
              title: error.missingCertificateTitle,
              summary: error.missingCertificateSummary,
              hideSubmitError: true,
            },
            statusCode: 404,
          })
    }

    await this.getDebtLessCertificate(auth)
    // User can owe under a million and should still pass so the status is checked with a pdf manualy by Sýslumenn

    return { success: true }
  }

  async courtBankruptcyCert({
    auth,
  }: TemplateApiModuleActionProps): Promise<BankruptcyHistoryResult> {
    const cert = await this.judicialAdministrationService.searchBankruptcy(auth)

    for (const [_, value] of Object.entries(cert)) {
      if (
        value.bankruptcyStatus &&
        BANNED_BANKRUPTCY_STATUSES.includes(value.bankruptcyStatus)
      ) {
        throw new TemplateApiError(
          {
            title: error.missingJudicialAdministrationificateTitle,
            summary: error.missingJudicialAdministrationificateSummary,
          },
          400,
        )
      }
    }

    return cert[0]
  }

  async submitOperatingLicenseApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<{
    success: boolean
    orderId?: string
  }> {
    const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(
      auth,
      application.id,
    )

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er hægt að skila inn umsókn af því að ekki hefur tekist að taka við greiðslu.',
      )
    }

    try {
      const uploadDataName = 'rekstrarleyfi1.0'
      const uploadDataId = 'rekstrarleyfi1.0'
      const info = getValueViaPath(application.answers, 'info') as Info
      const applicant: Person = {
        name: '',
        ssn: auth.nationalId,
        phoneNumber: info?.phoneNumber,
        email: info?.email,
        homeAddress: '',
        postalCode: '',
        city: '',
        signed: true,
        type: PersonType.Plaintiff,
      }

      const actors: Person[] = application.applicantActors.map((actor) => ({
        name: '',
        ssn: actor,
        phoneNumber: '',
        email: '',
        homeAddress: '',
        postalCode: '',
        city: '',
        signed: true,
        type: PersonType.CounterParty,
      }))

      const persons: Person[] = [applicant, ...actors]

      const attachments = await this.getAttachments(application, auth)
      const extraData = getExtraData(application)
      const result: DataUploadResponse = await this.syslumennService
        .uploadData(
          persons,
          attachments,
          extraData,
          uploadDataName,
          uploadDataId,
        )
        .catch((e) => {
          throw new Error(`Application submission failed ${e}`)
        })
      return {
        success: result.success,
      }
    } catch (e) {
      throw new Error(`Application submission failed ${e}`)
    }
  }

  async getCriminalRecord(nationalId: string): Promise<CriminalRecord> {
    const document = await this.criminalRecordService.getCriminalRecord(
      nationalId,
    )

    // Call sýslumaður to get the document sealed before handing it over to the user
    const sealedDocumentResponse = await this.syslumennService.sealDocument(
      document.contentBase64,
    )

    if (!sealedDocumentResponse?.skjal) {
      throw new Error('Eitthvað fór úrskeiðis.')
    }

    const sealedDocument: CriminalRecord = {
      contentBase64: sealedDocumentResponse.skjal,
    }

    return sealedDocument
  }

  private async getAttachments(
    application: ApplicationWithAttachments,
    auth: User,
  ): Promise<Attachment[]> {
    const attachments: Attachment[] = []

    const dateStr = new Date(Date.now()).toISOString().substring(0, 10)

    let criminalRecordSSN = application.applicant

    if (!isPerson(application.applicant)) {
      // Go through actors until a person is found
      // if no person then an error is thrown in the next step
      application.applicantActors.every((actor) => {
        if (isPerson(actor)) {
          criminalRecordSSN = actor
          return false
        }
        return true
      })
    }

    const criminalRecord = await this.getCriminalRecord(criminalRecordSSN)
    if (criminalRecord.contentBase64) {
      attachments.push({
        name: `sakavottord_${application.applicant}_${dateStr}.pdf`,
        content: criminalRecord.contentBase64,
      })
    }

    const debtLess = await this.getDebtLessCertificate(auth)
    if (debtLess.certificate?.document) {
      attachments.push({
        name: `skuldleysisvottord_${application.applicant}_${dateStr}.pdf`,
        content: debtLess.certificate?.document,
      })
    }

    for (let i = 0; i < AttachmentPaths.length; i++) {
      const { path, prefix } = AttachmentPaths[i]
      const attachmentAnswerData = getValueViaPath(
        application.answers,
        path,
      ) as File[]
      const attachmentAnswer = attachmentAnswerData.pop()

      if (attachmentAnswer) {
        const fileType = attachmentAnswer.name?.split('.').pop()
        const name = `${prefix}_${dateStr}.${fileType}`
        const fileName = (application.attachments as ApplicationAttachments)[
          attachmentAnswer?.key
        ]
        const content = await this.getFileContentBase64(fileName)
        attachments.push({ name, content } as Attachment)
      }
    }
    return attachments
  }

  private async getFileContentBase64(fileName: string): Promise<string> {
    const { bucket, key } = AmazonS3URI(fileName)

    try {
      return (await this.awsService.getFileB64(bucket, key)) ?? ''
    } catch (e) {
      this.logger.error('Error getting file', { error: e })
      return 'err'
    }
  }
}
