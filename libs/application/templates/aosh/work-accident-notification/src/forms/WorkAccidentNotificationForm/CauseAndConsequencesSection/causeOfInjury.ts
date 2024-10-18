import {
  buildCustomField,
  buildHiddenInput,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { causeAndConsequences, sections } from '../../../lib/messages'

export const causeOfInjurySection = (index: number) =>
  buildSubSection({
    id: 'causeOfInjury',
    title: sections.draft.causeOfInjury,
    children: [
      buildMultiField({
        title: causeAndConsequences.causeOfInjury.title,
        description: causeAndConsequences.causeOfInjury.description,
        children: [
          buildHiddenInput({
            id: `causeOfInjury[${index}].contactModeOfInjuryMostSerious`,
          }),
          buildCustomField(
            {
              id: `causeOfInjury[${index}].contactModeOfInjury`,
              title: '',
              component: 'CauseOfInjury',
            },
            {
              index: index,
            },
          ),
        ],
      }),
    ],
  })
