import { buildDataProviderItem } from '@island.is/application/core'
import {
  DistrictsApi,
  MaritalStatusApi,
  NationalRegistryUserApi,
  UserProfileApi,
  ReligionCodesApi,
  DistrictCommissionersPaymentCatalogApi,
} from '../../dataProviders'
import { m } from '../../lib/messages'

export const dataCollection = [
  buildDataProviderItem({
    provider: NationalRegistryUserApi,
    title: m.dataCollectionNationalRegistryTitle,
    subTitle: m.dataCollectionNationalRegistrySubtitle,
  }),
  buildDataProviderItem({
    provider: UserProfileApi,
    title: m.dataCollectionUserProfileTitle,
    subTitle: m.dataCollectionUserProfileSubtitle,
  }),
  buildDataProviderItem({
    provider: MaritalStatusApi,
    title: m.dataCollectionMaritalStatusTitle,
    subTitle: m.dataCollectionMaritalStatusDescription,
  }),
  buildDataProviderItem({
    //TODO: provider: 
    title: m.dataCollectionBirthCertificateTitle,
    subTitle: m.dataCollectionBirthCertificateDescription,
  }),
  buildDataProviderItem({
    provider: DistrictsApi,
    title: '',
  }),
  buildDataProviderItem({
    provider: ReligionCodesApi,
    title: '',
    subTitle: '',
  }),
  buildDataProviderItem({
    provider: DistrictCommissionersPaymentCatalogApi,
    title: '',
    subTitle: '',
  }),
]
