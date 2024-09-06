import {
  defineTemplateApi,
  InstitutionNationalIds,
  PaymentCatalogApi,
} from '@island.is/application/types'
export {
  NationalRegistryUserApi,
  HasTeachingRightsApi,
  UserProfileApi,
  CurrentLicenseApi,
  DrivingAssessmentApi,
  QualityPhotoApi,
  ExistingApplicationApi,
} from '@island.is/application/types'

export const SyslumadurPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.SYSLUMENN,
  },
  externalDataId: 'payment',
})

export const GlassesCheckApi = defineTemplateApi({
  action: 'glassesCheck',
})
