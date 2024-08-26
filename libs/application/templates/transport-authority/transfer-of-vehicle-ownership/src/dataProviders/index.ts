import {
  defineTemplateApi,
  InstitutionNationalIds,
  PaymentCatalogApi,
  UserProfileApi,
} from '@island.is/application/types'

export { IdentityApi, UserProfileApi } from '@island.is/application/types'

export const SamgongustofaPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.SAMGONGUSTOFA,
  },
  externalDataId: 'payment',
})

export const CurrentVehiclesApi = defineTemplateApi({
  action: 'getCurrentVehiclesWithOwnerchangeChecks',
  externalDataId: 'currentVehicleList',
})

export const InsuranceCompaniesApi = defineTemplateApi({
  action: 'getInsuranceCompanyList',
  externalDataId: 'insuranceCompanyList',
})

export const UserInfoApi = UserProfileApi.configure({
  params: {
    validatePhoneNumber: true,
    validateEmail: true,
  },
})
