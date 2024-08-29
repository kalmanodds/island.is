import { TrWebCommonsExternalPortalsApiModelsDocumentsDocument } from '../..'
import {
  Period,
  DomesticBankInfo,
  ForeignBankInfo,
  TaxInfo,
  ApplicantInfo,
  Employer,
} from '../socialInsuranceAdministrationClient.type'

export interface ApplicationDTO {
  period?: Period
  comment?: string
  reasons?: Array<string>
  applicationId?: string
  domesticBankInfo?: DomesticBankInfo
  foreignBankInfo?: ForeignBankInfo
  taxInfo?: TaxInfo
  applicantInfo?: ApplicantInfo
  hasAbroadResidence?: boolean
  hasOneTimePayment?: boolean
  isSailorPension?: boolean
  isRental?: boolean
  hasAStudyingAdolescenceResident?: boolean
  uploads?: Array<TrWebCommonsExternalPortalsApiModelsDocumentsDocument>
  employment?: string
  employers?: Array<Employer>
}
