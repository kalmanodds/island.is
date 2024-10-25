import { defineMessages } from 'react-intl'

export const dataSchema = defineMessages({
  nationalId: {
    id: 'ra.application:dataSchema.national.id',
    defaultMessage: 'Kennitala er ekki á réttu formi',
    description: 'Error message when nationalid is wrong',
  },
  phoneNumber: {
    id: 'ra.application:dataSchema.phoneNumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'Error message when phone number is invalid.',
  },

  errorNoValue: {
    id: 'ra.application:dataSchema.errorNoValue',
    defaultMessage: 'Þessi reitur þarf að vera útfylltur.',
    description: 'Error message when a required field has not been filled out',
  },
  errorValidateMeterStatus: {
    id: 'ra.application:dataSchema.errorValidateMeterStatus',
    defaultMessage: 'Sláðu inn stöðu í tölustöfum',
    description: 'Error message when electricity meter status is invalid.',
  },
})
