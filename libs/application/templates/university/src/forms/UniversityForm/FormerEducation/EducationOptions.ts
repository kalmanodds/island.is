import {
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { formerEducation } from '../../../lib/messages/formerEducation'
import { Routes } from '../../../lib/constants'
import { Program } from '@island.is/clients/university-gateway-api'
import { FormValue } from '@island.is/application/types'

import { InlineResponse200Items } from '@island.is/clients/inna'

export const EducationOptionsSubSection = buildSubSection({
  id: Routes.EDUCATIONOPTIONS,
  title: formerEducation.labels.educationOptions.pageTitle,
  children: [
    buildRadioField({
      id: `${Routes.EDUCATIONOPTIONS}`,
      title: formerEducation.labels.educationOptions.pageTitle,
      description: formerEducation.labels.educationOptions.pageDescription,
      condition: (formValue: FormValue, externalData) => {
        const data = externalData.innaEducation
          .data as Array<InlineResponse200Items>
        const hasInnaData = data && data.length > 0
        return !hasInnaData
      },
      options: (application, field) => {
        const externalData = application.externalData
        const chosenProgram = getValueViaPath(
          application.answers,
          'programInformation.program',
          undefined,
        ) as string | undefined

        const programs = externalData.programs.data as Array<Program>

        const showException =
          programs.filter((x) => x.id === chosenProgram)[0].allowException ??
          false

        const options = [
          {
            label: formerEducation.labels.educationOptions.diplomaFinishedLabel,

            subLabel:
              formerEducation.labels.educationOptions
                .diplomaFinishedDescription,

            value: 'diploma',
          },
          {
            label:
              formerEducation.labels.educationOptions.diplomaNotFinishedLabel,

            subLabel:
              formerEducation.labels.educationOptions
                .diplomaNotFinishedDescription,

            value: 'notFinished',
          },
          {
            label: formerEducation.labels.educationOptions.thirdLevelLabel,

            subLabel:
              formerEducation.labels.educationOptions.thirdLevelDescription,

            value: 'thirdLevel',
          },
        ]

        if (showException) {
          options.push({
            label: formerEducation.labels.educationOptions.exemptionLabel,

            subLabel:
              formerEducation.labels.educationOptions.exemptionDescription,

            value: 'exemption',
          })
        }

        return options
      },
    }),
  ],
})
