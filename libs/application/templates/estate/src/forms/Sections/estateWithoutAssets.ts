import {
  buildDescriptionField,
  buildSection,
  buildMultiField,
  buildRadioField,
  getValueViaPath,
  YES,
  NO,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { JA, NEI } from '../../lib/constants'

export const estateWithoutAssets = buildSection({
  id: 'estateAssetsExist',
  title: m.doAssetsExistSidebarTitle,
  children: [
    buildMultiField({
      id: 'estateAssetsExist',
      title: m.doAssetsExist,
      description: '',
      children: [
        buildRadioField({
          id: 'estateWithoutAssets.estateAssetsExist',
          title: m.doAssetsExistSelect,
          width: 'half',
          largeButtons: false,
          options: [
            { label: JA, value: YES },
            { label: NEI, value: NO },
          ],
        }),
        buildRadioField({
          id: 'estateWithoutAssets.estateDebtsExist',
          title: m.doDebtsExist,
          width: 'half',
          largeButtons: false,
          space: 'containerGutter',
          options: [
            { label: JA, value: YES },
            { label: NEI, value: NO },
          ],
          condition: (answers) =>
            getValueViaPath(
              answers,
              'estateWithoutAssets.estateAssetsExist',
            ) === YES,
        }),
        buildDescriptionField({
          id: 'spaceNoAssets',
          title: '',
          space: 'containerGutter',
        }),
        buildDescriptionField({
          id: 'helper',
          title: '',
          condition: (answers) =>
            getValueViaPath(
              answers,
              'estateWithoutAssets.estateAssetsExist',
            ) === YES,
        }),
      ],
    }),
  ],
})
