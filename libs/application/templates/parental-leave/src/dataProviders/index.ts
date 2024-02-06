import { defineTemplateApi } from '@island.is/application/types'

export const ChildrenApi = defineTemplateApi({
  action: 'getChildren',
  externalDataId: 'children',
})

export const GetPersonInformation = defineTemplateApi({
  action: 'getPerson',
  externalDataId: 'person',
})

export const GetUnions = defineTemplateApi({
  action: 'getUnions',
  externalDataId: 'unions',
})

export const GetPensionFunds = defineTemplateApi({
  action: 'getPensionFunds',
  externalDataId: 'pensionFunds',
})
