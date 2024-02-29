import {
  buildAlertMessageField,
  buildCustomField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { formerEducation } from '../../../../lib/messages/formerEducation'
import { Routes } from '../../../../lib/constants'
import { degreeLevelOptions } from './degreeLevelOptions'
import { FormValue } from '@island.is/application/types'

export const NotFinishedEducationSubSection = buildSubSection({
  id: `${Routes.EDUCATIONDETAILS}.notFinishedDetails`,
  title: formerEducation.labels.educationDetails.pageTitle,
  condition: (answers: FormValue, externalData) => {
    const optionAnswers = getValueViaPath(answers, 'educationOptions')
    return optionAnswers === 'notFinished'
  },
  children: [
    buildMultiField({
      id: `${Routes.EDUCATIONDETAILS}.notFinishedDetailsMultiField`,
      title: formerEducation.labels.educationDetails.pageTitle,
      description: formerEducation.labels.educationDetails.pageDescription,
      children: [
        buildAlertMessageField({
          id: `${Routes.EDUCATIONDETAILS}.notFinishedDetails.innuInformation`,
          title: '',
          alertType: 'info',
          message:
            formerEducation.labels.educationDetails.informationAlertDescription,
        }),
        buildTextField({
          id: `${Routes.EDUCATIONDETAILS}.notFinishedDetails.school`,
          title: formerEducation.labels.educationDetails.schoolLabel,
          width: 'half',
          required: true,
        }),
        buildSelectField({
          id: `${Routes.EDUCATIONDETAILS}.notFinishedDetails.degreeLevel`,
          title: formerEducation.labels.educationDetails.degreeLevelLabel,
          width: 'half',
          required: true,
          options: () => {
            return degreeLevelOptions
          },
        }),
        buildTextField({
          id: `${Routes.EDUCATIONDETAILS}.notFinishedDetails.moreDetails`,
          variant: 'textarea',
          title: formerEducation.labels.educationDetails.moreDetailsLabel,
        }),
        buildCustomField({
          id: `${Routes.EDUCATIONDETAILS}.finishedDetails`,
          title: '',
          component: 'EducationDetails',
        }),
      ],
    }),
  ],
})
