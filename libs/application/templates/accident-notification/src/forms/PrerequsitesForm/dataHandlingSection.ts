import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { externalData } from '../../lib/messages'

export const dataHandlingSection = buildSection({
  id: 'ExternalDataSection',
  title: externalData.agreementDescription.listTitle,
  children: [
    buildMultiField({
      title: externalData.agreementDescription.sectionTitle,
      id: 'agreementDescriptionMultiField',
      space: 2,
      children: [
        buildCustomField({
          id: 'agreementDescriptionCustomField',
          title: '',
          component: 'AgreementDescription',
          doesNotRequireAnswer: true,
        }),
        buildCustomField(
          {
            id: 'extrainformationWithDataprovider',
            title: '',
            component: 'DescriptionWithLink',
            doesNotRequireAnswer: true,
          },
          {
            descriptionFirstPart: externalData.extraInformation.description,
            descriptionSecondPart: '',
            linkName: externalData.extraInformation.linkText,
            url: externalData.extraInformation.link,
          },
        ),
      ],
    }),
  ],
})
