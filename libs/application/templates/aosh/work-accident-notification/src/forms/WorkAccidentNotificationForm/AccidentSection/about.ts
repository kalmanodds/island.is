import {
  buildAlertMessageField,
  buildCustomField,
  buildDateField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { accident, sections, shared } from '../../../lib/messages'
import { NO, YES } from '@island.is/application/types'
import { MunicipalityDto } from '@island.is/clients/work-accident-ver'

export const aboutSection = buildSubSection({
  id: 'accident',
  title: sections.draft.about,
  children: [
    buildMultiField({
      id: 'accidentMultiField',
      title: accident.about.pageTitle,
      description: accident.about.description,
      children: [
        buildDescriptionField({
          id: 'accident.description',
          titleVariant: 'h5',
          title: accident.about.informationHeading,
        }),
        buildDateField({
          id: 'accident.date',
          title: accident.about.date,
          width: 'half',
          required: true,
        }),
        buildTextField({
          id: 'accident.time',
          title: accident.about.time,
          placeholder: accident.about.timePlaceholder,
          required: true,
          width: 'half',
          format: '##:##',
        }),
        buildSelectField({
          id: 'accident.didAoshCome',
          title: accident.about.didAoshCome,
          width: 'half',
          required: true,
          options: [
            {
              value: YES,
              label: shared.options.yes,
            },
            {
              value: NO,
              label: shared.options.no,
            },
          ],
        }),
        buildSelectField({
          id: 'accident.didPoliceCome',
          title: accident.about.didPoliceCome,
          width: 'half',
          required: true,
          options: [
            {
              value: YES,
              label: shared.options.yes,
            },
            {
              value: NO,
              label: shared.options.no,
            },
          ],
        }),
        buildSelectField({
          id: 'accident.municipality',
          title: accident.about.municipality,
          width: 'half',
          required: true,
          options: (application) => {
            const municipalities = getValueViaPath(
              application.externalData,
              'aoshData.data.municipality',
              [],
            ) as MunicipalityDto[]

            return municipalities
              .filter(
                (municipality) => municipality?.code && municipality?.name,
              )
              .map(({ code, name }) => ({
                value: code || '',
                label: name || '',
              }))
          },
        }),
        buildTextField({
          id: 'accident.exactLocation',
          title: accident.about.exactLocation,
          width: 'half',
          // TODO(balli) is this required ??
        }),
        buildDescriptionField({
          id: 'accident.describe.descriptionHeading',
          titleVariant: 'h5',
          title: accident.about.describeHeading,
          marginTop: 3,
        }),
        buildDescriptionField({
          id: 'accident.describe.description',
          title: '',
          description: accident.about.describeDescription,
          marginTop: 3,
          marginBottom: 2,
        }),
        buildAlertMessageField({
          id: 'accident.alertMessage',
          title: accident.about.alertFieldTitle,
          message: accident.about.alertFieldDescription,
          alertType: 'warning',
        }),
        buildTextField({
          id: 'accident.wasDoing',
          title: accident.about.wasDoingTitle,
          variant: 'textarea',
          placeholder: accident.about.wasDoingPlaceholder,
          rows: 7,
          required: true,
        }),
        buildTextField({
          id: 'accident.wentWrong',
          title: accident.about.wentWrongTitle,
          variant: 'textarea',
          placeholder: accident.about.wenWrongPlaceholder,
          rows: 7,
          required: true,
        }),
        buildTextField({
          id: 'accident.how',
          title: accident.about.howTitle,
          variant: 'textarea',
          placeholder: accident.about.howPlaceholder,
          rows: 7,
          required: true,
        }),
        buildDescriptionField({
          id: 'accident.describe.locationOfAccidentHeading',
          titleVariant: 'h5',
          title: accident.about.locationOfAccidentHeading,
          marginTop: 3,
        }),
        buildHiddenInput({
          id: 'accident.accidentLocationParentGroup',
        }),
        buildCustomField({
          id: 'accident.accidentLocation',
          title: '',
          component: 'AccidentLocation',
        }),
      ],
    }),
  ],
})
