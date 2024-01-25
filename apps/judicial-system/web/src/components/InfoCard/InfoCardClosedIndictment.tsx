import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Text } from '@island.is/island-ui/core'
import {
  capitalize,
  formatCaseType,
  readableIndictmentSubtypes,
} from '@island.is/judicial-system/formatters'
import { isIndictmentCase } from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'

import { FormContext } from '../FormProvider/FormProvider'
import InfoCard, { NameAndEmail } from './InfoCard'
import { infoCardActiveIndictment as m } from './InfoCard.strings'

const InfoCardClosedIndictment: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const defenders = workingCase.defendants?.map((defendant) => {
    return {
      name: defendant.defenderName || '',
      defenderNationalId: defendant.defenderNationalId || '',
      sessionArrangement: undefined,
      email: defendant.defenderEmail || '',
      phoneNumber: defendant.defenderPhoneNumber || '',
    }
  })

  return (
    <InfoCard
      data={[
        {
          title: formatMessage(core.policeCaseNumber),
          value: workingCase.policeCaseNumbers?.map((n) => (
            <Text key={n}>{n}</Text>
          )),
        },
        {
          title: formatMessage(core.courtCaseNumber),
          value: workingCase.courtCaseNumber,
        },
        {
          title: formatMessage(core.prosecutor),
          value: `${workingCase.prosecutorsOffice?.name}`,
        },
        {
          title: formatMessage(core.court),
          value: workingCase.court?.name,
        },
        {
          title: formatMessage(m.prosecutor),
          value: NameAndEmail(
            workingCase.prosecutor?.name,
            workingCase.prosecutor?.email,
          ),
        },
        {
          title: formatMessage(core.judge),
          value: NameAndEmail(
            workingCase.judge?.name,
            workingCase.judge?.email,
          ),
        },
        {
          title: formatMessage(m.offence),
          value: isIndictmentCase(workingCase.type) ? (
            <>
              {readableIndictmentSubtypes(
                workingCase.policeCaseNumbers,
                workingCase.indictmentSubtypes,
              ).map((subtype) => (
                <Text key={subtype}>{capitalize(subtype)}</Text>
              ))}
            </>
          ) : (
            formatCaseType(workingCase.type)
          ),
        },
      ]}
      defendants={
        workingCase.defendants
          ? {
              title: capitalize(
                workingCase.defendants.length > 1
                  ? formatMessage(core.indictmentDefendants)
                  : formatMessage(core.indictmentDefendant, {
                      gender: workingCase.defendants[0].gender,
                    }),
              ),
              items: workingCase.defendants,
            }
          : undefined
      }
      defenders={defenders}
    />
  )
}

export default InfoCardClosedIndictment
