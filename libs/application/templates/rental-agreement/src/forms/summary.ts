import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

export const Summary = buildSection({
  id: 'summary',
  title: 'Samantekt',
  children: [
    buildMultiField({
      id: 'summaryInfo',
      title: 'Samantekt',
      description: 'Einhver texti um samantekt',
      children: [
        buildDescriptionField({
          id: 'summaryDescription',
          title: 'Einhver titill',
          description: 'Einhver annar texti um eitthvað',
        }),
      ],
    }),
  ],
})
